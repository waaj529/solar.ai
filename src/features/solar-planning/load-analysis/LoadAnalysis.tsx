import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";

export function LoadAnalysis() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Hero section - responsive typography */}
      <div className="max-w-3xl">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-2 sm:mb-3">
          <span className="text-primary">Load Analysis</span>
          <span className="text-secondary"> &amp; System Sizing</span>
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
          Comprehensive analysis of your energy requirements and optimal system
          configuration.
        </p>
      </div>

      {/* Summary cards - responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-primary text-sm sm:text-base">
              Total Load
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              25.5 kW
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Peak demand
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-primary text-sm sm:text-base">
              Daily Consumption
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              120 kWh
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Average daily usage
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-primary text-sm sm:text-base">
              System Size
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              30 kW
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Recommended capacity
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Load distribution chart - responsive spacing and typography */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2 sm:pb-3">
          <CardTitle className="text-foreground text-base sm:text-lg">
            Load Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 pt-0">
          {[
            { label: "Lighting", value: 30 },
            { label: "HVAC", value: 45 },
            { label: "Equipment", value: 20 },
            { label: "Others", value: 5 },
          ].map((item) => (
            <div key={item.label} className="space-y-1 sm:space-y-2">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="font-medium">{item.label}</span>
                <span className="font-semibold">{item.value}%</span>
              </div>
              <Progress value={item.value} className="h-2 sm:h-3 bg-muted" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}