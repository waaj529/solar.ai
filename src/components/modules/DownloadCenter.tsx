import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";
import { Download, FileText, FileSpreadsheet, Image, Share } from "lucide-react";

export function DownloadCenter() {
  const reports = [
    {
      title: "Complete Project Report",
      description: "Comprehensive PDF report including all analysis and recommendations",
      format: "PDF",
      size: "2.5 MB",
      icon: FileText,
      color: "text-red-600"
    },
    {
      title: "Bill of Materials",
      description: "Detailed BOM with pricing and specifications in Excel format",
      format: "Excel",
      size: "856 KB",
      icon: FileSpreadsheet,
      color: "text-green-600"
    },
    {
      title: "SLD Diagram",
      description: "Single Line Diagram in scalable vector format",
      format: "SVG",
      size: "245 KB",
      icon: Image,
      color: "text-blue-600"
    },
    {
      title: "Load Analysis Report",
      description: "Detailed load analysis and system sizing calculations",
      format: "PDF",
      size: "1.2 MB",
      icon: FileText,
      color: "text-red-600"
    },
    {
      title: "Solar Yield Data",
      description: "Monthly and annual solar generation estimates",
      format: "Excel",
      size: "432 KB",
      icon: FileSpreadsheet,
      color: "text-green-600"
    },
    {
      title: "Rooftop Layout",
      description: "High-resolution rooftop layout with dimensions",
      format: "PDF",
      size: "3.1 MB",
      icon: FileText,
      color: "text-red-600"
    },
    {
      title: "Project Timeline",
      description: "Gantt chart and project schedule in Excel format",
      format: "Excel",
      size: "298 KB",
      icon: FileSpreadsheet,
      color: "text-green-600"
    },
    {
      title: "Technical Specifications",
      description: "Equipment datasheets and technical documentation",
      format: "PDF",
      size: "4.7 MB",
      icon: FileText,
      color: "text-red-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Download Center</h2>
          <p className="text-muted-foreground">Access all project reports and documentation in multiple formats.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Share className="h-4 w-4 mr-2" />
            Share Project
          </Button>
          <Button variant="default">
            <Download className="h-4 w-4 mr-2" />
            Download All
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Total Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{reports.length}</div>
            <p className="text-sm text-muted-foreground">Available downloads</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Total Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">13.4 MB</div>
            <p className="text-sm text-muted-foreground">All files combined</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Last Updated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">2 hours ago</div>
            <p className="text-sm text-muted-foreground">Auto-generated</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((report, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg bg-gray-100 ${report.color}`}>
                    <report.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{report.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{report.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                        {report.format}
                      </span>
                      <span>{report.size}</span>
                    </div>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Export Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <FileText className="h-8 w-8 text-red-600" />
              <span className="font-semibold">PDF Package</span>
              <span className="text-sm text-muted-foreground">All reports in PDF format</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <FileSpreadsheet className="h-8 w-8 text-green-600" />
              <span className="font-semibold">Excel Package</span>
              <span className="text-sm text-muted-foreground">Data sheets and calculations</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <Image className="h-8 w-8 text-blue-600" />
              <span className="font-semibold">Visual Package</span>
              <span className="text-sm text-muted-foreground">Diagrams and layouts</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}