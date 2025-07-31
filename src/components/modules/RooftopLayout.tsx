import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";
import { Upload, Download, RotateCcw } from "lucide-react";

export function RooftopLayout() {
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
          <Button variant="outline" className="text-xs sm:text-sm">
            <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
            <span className="hidden sm:inline">Auto-Generate</span>
            <span className="sm:hidden">Generate</span>
          </Button>
          <Button variant="default" className="text-xs sm:text-sm">
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
              <div className="bg-gradient-to-br from-blue-50 to-green-50 border-2 border-dashed border-primary/30 rounded-lg p-4 sm:p-8 text-center min-h-[300px] sm:min-h-[400px] flex items-center justify-center">
                <div className="space-y-3 sm:space-y-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 21l4-7 4 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-foreground">Optimized Panel Layout</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">75 panels arranged in 5 strings of 15 panels each</p>
                  </div>
                  {/* Responsive stats grid */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm max-w-md mx-auto">
                    <div className="bg-white/50 p-2 sm:p-3 rounded-lg">
                      <div className="font-semibold text-primary">Roof Area</div>
                      <div>450 m²</div>
                    </div>
                    <div className="bg-white/50 p-2 sm:p-3 rounded-lg">
                      <div className="font-semibold text-primary">Panel Coverage</div>
                      <div>65%</div>
                    </div>
                    <div className="bg-white/50 p-2 sm:p-3 rounded-lg">
                      <div className="font-semibold text-primary">Tilt Angle</div>
                      <div>25°</div>
                    </div>
                    <div className="bg-white/50 p-2 sm:p-3 rounded-lg">
                      <div className="font-semibold text-primary">Azimuth</div>
                      <div>180° (South)</div>
                    </div>
                  </div>
                </div>
              </div>
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
                <span className="font-semibold">75</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span>Strings</span>
                <span className="font-semibold">5</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span>Panels per String</span>
                <span className="font-semibold">15</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span>Row Spacing</span>
                <span className="font-semibold">3.5m</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span>Setback Distance</span>
                <span className="font-semibold">1.5m</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span>Shading Factor</span>
                <span className="font-semibold">2%</span>
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
                <span className="font-semibold text-green-600">✓ South-facing</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span>Tilt Optimization</span>
                <span className="font-semibold text-green-600">✓ 25° (Optimal)</span>
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