import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";
import { Download, FileSpreadsheet, AlertCircle, RefreshCw } from "lucide-react";
import { Skeleton } from "../../shared/ui/skeleton";
import { Alert, AlertDescription } from "../../shared/ui/alert";
import { getProjectBOMByProjectId } from "../../lib/api";
import { useDebouncedAPI } from "../../shared/hooks/use-debounced-api";

interface BOMItem {
  category: string;
  item: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total: number;
  specifications?: Record<string, unknown>;
}

interface BOMData {
  items: BOMItem[];
  total_material_cost: number;
  estimated_labor_cost: number;
  total_project_cost: number;
  currency?: string;
  [key: string]: unknown;
}

export function BillOfMaterials() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<BOMData | null>(null);

  // Use debounced API call to prevent duplicate requests
  const { debouncedCall: debouncedGetBOM, isExecuting } = useDebouncedAPI(
    getProjectBOMByProjectId,
    { delay: 500, maxDelay: 2000 }
  );

  // Load BOM data on component mount
  useEffect(() => {
    const loadBOM = async () => {
      const userId = localStorage.getItem('encrypted_user_id') || localStorage.getItem('anon_user_id') || '';
      const loadId = localStorage.getItem('latest_load_id') || '';

      if (!userId || !loadId) {
        setError('Please complete Load Analysis first to generate Bill of Materials.');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const bomData = await debouncedGetBOM({ user_id: userId, load_id: loadId });
        if (bomData) {
          setData(bomData as BOMData);
        }
      } catch (e: any) {
        setError(e?.message || 'Failed to load Bill of Materials');
      } finally {
        setLoading(false);
      }
    };

    loadBOM();
  }, [debouncedGetBOM]);

  const refresh = async () => {
    const userId = localStorage.getItem('encrypted_user_id') || localStorage.getItem('anon_user_id') || '';
    const loadId = localStorage.getItem('latest_load_id') || '';

    if (!userId || !loadId) {
      setError('Please complete Load Analysis first to generate Bill of Materials.');
      return;
    }

    if (isExecuting()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const bomData = await debouncedGetBOM({ user_id: userId, load_id: loadId });
      if (bomData) {
        setData(bomData as BOMData);
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to refresh Bill of Materials');
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = () => {
    if (!data?.items) {
      setError('No BOM data available for export.');
      return;
    }

    try {
      // Create CSV content
      const headers = ['Category', 'Item', 'Quantity', 'Unit', 'Unit Price', 'Total'];
      const csvContent = [
        headers.join(','),
        ...data.items.map(item => [
          item.category,
          item.item,
          item.quantity,
          item.unit,
          item.unit_price,
          item.total
        ].join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bom-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setError('Failed to export Excel file.');
    }
  };

  const handleDownloadPDF = () => {
    if (!data?.items) {
      setError('No BOM data available for download.');
      return;
    }

    try {
      // For now, just show a message - PDF generation would require a backend service
      alert('PDF download feature requires backend integration. Please use Excel export for now.');
    } catch (e: any) {
      setError('Failed to download PDF file.');
    }
  };

  const renderBOMContent = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96 w-full" />
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

    if (!data?.items || data.items.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No BOM Data Available</h3>
          <p className="text-muted-foreground">Complete your system design to generate a Bill of Materials.</p>
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Total Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{data.items.length}</div>
              <p className="text-sm text-muted-foreground">Line items</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Material Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${data.total_material_cost?.toLocaleString() || '0'}</div>
              <p className="text-sm text-muted-foreground">Total materials</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Labor Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${data.estimated_labor_cost?.toLocaleString() || '0'}</div>
              <p className="text-sm text-muted-foreground">Estimated labor</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Total Project</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${data.total_project_cost?.toLocaleString() || '0'}</div>
              <p className="text-sm text-muted-foreground">All inclusive</p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Detailed BOM</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">Category</th>
                    <th className="text-left p-3 font-semibold">Item Description</th>
                    <th className="text-right p-3 font-semibold">Qty</th>
                    <th className="text-left p-3 font-semibold">Unit</th>
                    <th className="text-right p-3 font-semibold">Unit Price</th>
                    <th className="text-right p-3 font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-primary/5">
                      <td className="p-3 text-sm">{item.category}</td>
                      <td className="p-3 font-medium">{item.item}</td>
                      <td className="p-3 text-right">{item.quantity}</td>
                      <td className="p-3 text-sm">{item.unit}</td>
                      <td className="p-3 text-right">${item.unit_price}</td>
                      <td className="p-3 text-right font-semibold text-primary">${item.total}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-primary/20 bg-primary/10">
                    <td colSpan={5} className="p-3 font-bold text-right">Total Material Cost:</td>
                    <td className="p-3 text-right font-bold text-primary text-lg">${data.total_material_cost?.toLocaleString() || '0'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Bill of Materials (BOM)</h2>
          <p className="text-muted-foreground">Complete list of components and materials required for the solar installation.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={refresh}
            disabled={loading || isExecuting()}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            variant="outline"
            onClick={handleExportExcel}
            disabled={!data?.items || data.items.length === 0}
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
          <Button 
            variant="default"
            onClick={handleDownloadPDF}
            disabled={!data?.items || data.items.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>
      
      {renderBOMContent()}
    </div>
  );
}