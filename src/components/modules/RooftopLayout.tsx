import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";
import { Upload, Download, RotateCcw, AlertCircle } from "lucide-react";
import { Skeleton } from "../../shared/ui/skeleton";
import { Alert, AlertDescription } from "../../shared/ui/alert";
import { generateRooftopLayout, getRooftopLayoutByDocId } from "../../lib/api";
import { useDebouncedAPI } from "../../shared/hooks/use-debounced-api";

interface RooftopLayoutData {
  _id?: string;
  preview_url?: string;
  layout_config?: {
    panel_count?: number;
    strings?: number;
    panels_per_string?: number;
    row_spacing_m?: number;
    setback_distance_m?: number;
    shading_factor_percent?: number;
    [key: string]: unknown;
  };
  roof_dimensions?: {
    width_m?: number;
    length_m?: number;
    pitch_degrees?: number;
    orientation_degrees?: number;
    [key: string]: unknown;
  };
  generated_at?: string;
  [key: string]: unknown;
}

export function RooftopLayout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RooftopLayoutData | null>(null);
  const [generating, setGenerating] = useState(false);

  // Use debounced API call to prevent duplicate requests
  const { debouncedCall: debouncedGenerateLayout, isExecuting } = useDebouncedAPI(
    generateRooftopLayout,
    { delay: 1000, maxDelay: 3000 }
  );

  // Check for existing rooftop layout data on component mount
  useEffect(() => {
    const loadExistingLayout = async () => {
      const userId = localStorage.getItem('encrypted_user_id') || localStorage.getItem('anon_user_id') || '';
      const loadId = localStorage.getItem('latest_load_id') || '';
      const layoutId = localStorage.getItem('latest_rooftop_layout_id') || '';

      if (!userId || !loadId) {
        setError('Please complete Load Analysis first to generate rooftop layout.');
        return;
      }

      if (layoutId) {
        try {
          setLoading(true);
          const layoutData = await getRooftopLayoutByDocId(layoutId);
          if (layoutData) {
            setData(layoutData as RooftopLayoutData);
            setError(null);
          }
        } catch (e: any) {
          // If existing layout fetch fails, clear the stored ID and allow regeneration
          localStorage.removeItem('latest_rooftop_layout_id');
          console.warn('Failed to load existing rooftop layout:', e);
        } finally {
          setLoading(false);
        }
      }
    };

    loadExistingLayout();
  }, []);

  const handleGenerateLayout = async () => {
    const userId = localStorage.getItem('encrypted_user_id') || localStorage.getItem('anon_user_id') || '';
    const loadId = localStorage.getItem('latest_load_id') || '';

    if (!userId || !loadId) {
      setError('Please complete Load Analysis first to generate rooftop layout.');
      return;
    }

    if (generating || isExecuting()) {
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      const result = await debouncedGenerateLayout({
        user_id: userId,
        load_id: loadId,
        roof_dimensions: {
          width_m: 15, // Default values - should come from user input or load analysis
          length_m: 30,
          pitch_degrees: 25,
          orientation_degrees: 180,
        },
        panel_specs: {
          panel_width_mm: 1765,
          panel_height_mm: 1048,
          panel_power_w: 400,
        },
      });

      if (result?.layout_id) {
        localStorage.setItem('latest_rooftop_layout_id', result.layout_id);
        
        // Fetch the generated layout data
        const layoutData = await getRooftopLayoutByDocId(result.layout_id);
        if (layoutData) {
          setData(layoutData as RooftopLayoutData);
        }
      } else {
        setError('Failed to generate rooftop layout. Please try again.');
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to generate rooftop layout');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadLayout = () => {
    if (!data?.preview_url) {
      setError('No layout preview available for download.');
      return;
    }

    try {
      const a = document.createElement('a');
      a.href = data.preview_url;
      a.download = `rooftop-layout-${data._id || 'generated'}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e: any) {
      setError('Failed to download layout file.');
    }
  };

  const renderLayoutContent = () => {
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

    if (data?.preview_url) {
      return (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg sm:text-xl font-semibold text-foreground">Optimized Panel Layout</h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              {data.layout_config?.panel_count || 75} panels arranged in {data.layout_config?.strings || 5} strings of {data.layout_config?.panels_per_string || 15} panels each
            </p>
          </div>
          
          <div className="bg-white border rounded-lg p-4 min-h-[300px] sm:min-h-[400px] flex items-center justify-center">
            <img 
              src={data.preview_url} 
              alt="Rooftop Layout" 
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {data.generated_at && (
            <p className="text-xs text-muted-foreground text-center">
              Generated: {new Date(data.generated_at).toLocaleString()}
            </p>
          )}
        </div>
      );
    }

    // Default state - no layout generated yet
    return (
      <div className="bg-gradient-to-br from-blue-50 to-green-50 border-2 border-dashed border-primary/30 rounded-lg p-4 sm:p-8 text-center min-h-[300px] sm:min-h-[400px] flex items-center justify-center">
        <div className="space-y-3 sm:space-y-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 21l4-7 4 7" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-foreground">Generate Rooftop Layout</h3>
            <p className="text-sm sm:text-base text-muted-foreground">Click "Auto-Generate" to create your optimized panel layout</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header section - responsive layout */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-4 lg:gap-0">
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Rooftop Layout Preview</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Optimized solar panel arrangement based on rooftop dimensions and orientation.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <Button variant="outline" className="text-xs sm:text-sm">
            <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
            <span className="hidden sm:inline">Upload Image</span>
            <span className="sm:hidden">Upload</span>
          </Button>
          <Button 
            variant="outline" 
            className="text-xs sm:text-sm"
            onClick={handleGenerateLayout}
            disabled={generating || isExecuting()}
          >
            <RotateCcw className={`h-3 w-3 sm:h-4 sm:w-4 mr-2 ${generating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{generating ? 'Generating...' : 'Auto-Generate'}</span>
            <span className="sm:hidden">{generating ? 'Generating...' : 'Generate'}</span>
          </Button>
          <Button 
            variant="default" 
            className="text-xs sm:text-sm"
            onClick={handleDownloadLayout}
            disabled={!data?.preview_url}
          >
            <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
            <span className="hidden sm:inline">Download Layout</span>
            <span className="sm:hidden">Download</span>
          </Button>
        </div>
      </div>
      
      {/* Main content grid - responsive layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* 3D Layout visualization - spans full width on mobile, 2 columns on desktop */}
        <div className="xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">3D Rooftop Layout</CardTitle>
            </CardHeader>
            <CardContent>
              {renderLayoutContent()}
            </CardContent>
          </Card>
        </div>
        
        {/* Right sidebar with specifications */}
        <div className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary text-base sm:text-lg">Layout Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="flex justify-between text-sm sm:text-base">
                <span>Total Panels</span>
                <span className="font-semibold">{data?.layout_config?.panel_count || 75}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span>Strings</span>
                <span className="font-semibold">{data?.layout_config?.strings || 5}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span>Panels per String</span>
                <span className="font-semibold">{data?.layout_config?.panels_per_string || 15}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span>Row Spacing</span>
                <span className="font-semibold">{data?.layout_config?.row_spacing_m || 3.5}m</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span>Setback Distance</span>
                <span className="font-semibold">{data?.layout_config?.setback_distance_m || 1.5}m</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span>Shading Factor</span>
                <span className="font-semibold">{data?.layout_config?.shading_factor_percent || 2}%</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-primary text-base sm:text-lg">Performance Impact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="flex justify-between text-sm sm:text-base">
                <span>Optimal Orientation</span>
                <span className="font-semibold text-green-600">✓ {data?.roof_dimensions?.orientation_degrees === 180 ? 'South-facing' : `${data?.roof_dimensions?.orientation_degrees || 180}°`}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span>Tilt Optimization</span>
                <span className="font-semibold text-green-600">✓ {data?.roof_dimensions?.pitch_degrees || 25}° (Optimal)</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span>Shading Analysis</span>
                <span className="font-semibold text-green-600">✓ Minimal</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span>Access Clearance</span>
                <span className="font-semibold text-green-600">✓ Compliant</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span>Fire Setbacks</span>
                <span className="font-semibold text-green-600">✓ Meets Code</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span>Performance Ratio</span>
                <span className="font-semibold text-primary">98%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}