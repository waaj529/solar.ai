import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";
import { Download, RefreshCw, AlertCircle } from "lucide-react";
import { Skeleton } from "../../shared/ui/skeleton";
import { Alert, AlertDescription } from "../../shared/ui/alert";
import { generateSLD, getSLDByDocId } from "../../lib/api";
import { useDebouncedAPI } from "../../shared/hooks/use-debounced-api";
import boltIcon from "@icons/image (202) 2 (1).png";

interface SLDData {
  _id?: string;
  svg_content?: string;
  svg_url?: string;
  system_config?: {
    panel_count?: number;
    inverter_count?: number;
    battery_capacity?: number;
    [key: string]: unknown;
  };
  generated_at?: string;
  [key: string]: unknown;
}

export function SLDDiagram() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<SLDData | null>(null);
  const [generating, setGenerating] = useState(false);

  // Use debounced API call to prevent duplicate requests
  const { debouncedCall: debouncedGenerateSLD, isExecuting } = useDebouncedAPI(
    generateSLD,
    { delay: 1000, maxDelay: 3000 }
  );

  // Check for existing SLD data on component mount
  useEffect(() => {
    const loadExistingSLD = async () => {
      const userId = localStorage.getItem('encrypted_user_id') || localStorage.getItem('anon_user_id') || '';
      const loadId = localStorage.getItem('latest_load_id') || '';
      const sldId = localStorage.getItem('latest_sld_id') || '';

      if (!userId || !loadId) {
        setError('Please complete Load Analysis first to generate SLD diagram.');
        return;
      }

      if (sldId) {
        try {
          setLoading(true);
          const sldData = await getSLDByDocId(sldId);
          if (sldData) {
            setData(sldData as SLDData);
            setError(null);
          }
        } catch (e: any) {
          // If existing SLD fetch fails, clear the stored ID and allow regeneration
          localStorage.removeItem('latest_sld_id');
          console.warn('Failed to load existing SLD:', e);
        } finally {
          setLoading(false);
        }
      }
    };

    loadExistingSLD();
  }, []);

  const handleGenerateSLD = async () => {
    const userId = localStorage.getItem('encrypted_user_id') || localStorage.getItem('anon_user_id') || '';
    const loadId = localStorage.getItem('latest_load_id') || '';

    if (!userId || !loadId) {
      setError('Please complete Load Analysis first to generate SLD diagram.');
      return;
    }

    if (generating || isExecuting()) {
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      const result = await debouncedGenerateSLD({
        user_id: userId,
        load_id: loadId,
        system_config: {
          // Extract system config from load analysis if available
          panel_count: 75, // Default values - should come from load analysis
          inverter_count: 6,
          battery_capacity: 20,
        },
      });

      if (result?.sld_id) {
        localStorage.setItem('latest_sld_id', result.sld_id);
        
        // Fetch the generated SLD data
        const sldData = await getSLDByDocId(result.sld_id);
        if (sldData) {
          setData(sldData as SLDData);
        }
      } else {
        setError('Failed to generate SLD diagram. Please try again.');
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to generate SLD diagram');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadSVG = () => {
    if (!data?.svg_content && !data?.svg_url) {
      setError('No SVG content available for download.');
      return;
    }

    try {
      if (data.svg_content) {
        // Create and download SVG file
        const blob = new Blob([data.svg_content], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sld-diagram-${data._id || 'generated'}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (data.svg_url) {
        // Download from URL
        const a = document.createElement('a');
        a.href = data.svg_url;
        a.download = `sld-diagram-${data._id || 'generated'}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (e: any) {
      setError('Failed to download SVG file.');
    }
  };

  const renderSLDContent = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-6 w-32 mx-auto" />
        </div>
      );
    }

    if (error) {
      return (
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      );
    }

    if (data?.svg_content || data?.svg_url) {
      return (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground">SLD Diagram Generated</h3>
            <p className="text-muted-foreground">
              {data.system_config?.panel_count || 75}kW Solar PV System with Grid Connection
            </p>
          </div>
          
          <div className="bg-white border rounded-lg p-4 min-h-[400px] flex items-center justify-center">
            {data.svg_content ? (
              <div 
                className="w-full h-full"
                dangerouslySetInnerHTML={{ __html: data.svg_content }}
              />
            ) : data.svg_url ? (
              <img 
                src={data.svg_url} 
                alt="SLD Diagram" 
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <div className="text-center text-muted-foreground">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p>SLD Diagram loaded successfully</p>
              </div>
            )}
          </div>

          {data.generated_at && (
            <p className="text-xs text-muted-foreground text-center">
              Generated: {new Date(data.generated_at).toLocaleString()}
            </p>
          )}
        </div>
      );
    }

    // Default state - no SLD generated yet
    return (
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center min-h-[400px] flex items-center justify-center">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Generate SLD Diagram</h3>
            <p className="text-muted-foreground">Click "Generate" to create your Single Line Diagram</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Auto-Generated SLD Diagram</h2>
        <p className="text-muted-foreground">Single Line Diagram automatically generated based on your system configuration.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            SLD Diagram Preview
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleGenerateSLD}
                disabled={generating || isExecuting()}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${generating ? 'animate-spin' : ''}`} />
                {generating ? 'Generating...' : 'Generate'}
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={handleDownloadSVG}
                disabled={!data?.svg_content && !data?.svg_url}
              >
                <Download className="h-4 w-4 mr-2" />
                Download SVG
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderSLDContent()}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">System Components</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Solar Panels</span>
              <span className="font-semibold">{data?.system_config?.panel_count || 75} x 400W</span>
            </div>
            <div className="flex justify-between">
              <span>String Inverters</span>
              <span className="font-semibold">{data?.system_config?.inverter_count || 6} x 5kW</span>
            </div>
            <div className="flex justify-between">
              <span>DC Combiner</span>
              <span className="font-semibold">3 Units</span>
            </div>
            <div className="flex justify-between">
              <span>AC Disconnect</span>
              <span className="font-semibold">1 Unit</span>
            </div>
            <div className="flex justify-between">
              <span>Production Meter</span>
              <span className="font-semibold">1 Unit</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Safety & Protection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>DC Circuit Breakers</span>
              <span className="font-semibold">15 Units</span>
            </div>
            <div className="flex justify-between">
              <span>AC Circuit Breakers</span>
              <span className="font-semibold">6 Units</span>
            </div>
            <div className="flex justify-between">
              <span>Surge Protection</span>
              <span className="font-semibold">DC & AC</span>
            </div>
            <div className="flex justify-between">
              <span>Grounding Equipment</span>
              <span className="font-semibold">Included</span>
            </div>
            <div className="flex justify-between">
              <span>Arc Fault Protection</span>
              <span className="font-semibold">Integrated</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}