import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/ui/card";
import { Button } from "../../../shared/ui/button";
import { Download, RefreshCw } from "lucide-react";
import boltIcon from "@icons/image (202) 2 (1).png";

export function SLDDiagram() {
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
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate
              </Button>
              <Button variant="default" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download SVG
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center min-h-[400px] flex items-center justify-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">SLD Diagram Generated</h3>
                <p className="text-muted-foreground">30kW Solar PV System with Grid Connection</p>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-start gap-2"><img src={boltIcon} alt="" className="h-4 w-4 mt-0.5" /><span>Solar PV Array (30kW)</span></li>
                <li className="flex items-start gap-2"><img src={boltIcon} alt="" className="h-4 w-4 mt-0.5" /><span>String Inverters (6 x 5kW)</span></li>
                <li className="flex items-start gap-2"><img src={boltIcon} alt="" className="h-4 w-4 mt-0.5" /><span>AC Distribution Panel</span></li>
                <li className="flex items-start gap-2"><img src={boltIcon} alt="" className="h-4 w-4 mt-0.5" /><span>Grid Connection Meter</span></li>
                <li className="flex items-start gap-2"><img src={boltIcon} alt="" className="h-4 w-4 mt-0.5" /><span>Protection & Isolation Devices</span></li>
              </ul>
            </div>
          </div>
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
              <span className="font-semibold">75 x 400W</span>
            </div>
            <div className="flex justify-between">
              <span>String Inverters</span>
              <span className="font-semibold">6 x 5kW</span>
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