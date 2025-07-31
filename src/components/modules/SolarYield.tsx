import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";

export function SolarYield() {
  return (
    <div className="space-y-8">
      {/* Hero section */}
      <div className="max-w-3xl">
        <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-3">
          <span className="text-primary">Solar Yield</span>
          <span className="text-secondary"> Estimation</span>
        </h2>
        <p className="text-base md:text-lg text-muted-foreground">
          Estimated solar energy generation based on location and system specifications.
        </p>
      </div>

      {/* Statistic cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Annual Yield", value: "45,600 kWh", desc: "Per year" },
          { title: "Monthly Average", value: "3,800 kWh", desc: "Per month" },
          { title: "Peak Generation", value: "28.5 kW", desc: "Maximum output" },
          { title: "Efficiency", value: "85.2%", desc: "System efficiency" },
        ].map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-primary">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{stat.value}</div>
              <p className="text-sm text-muted-foreground">{stat.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Monthly estimates */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-foreground">Monthly Solar Generation Estimate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { month: "January", yield: "2,850 kWh" },
              { month: "February", yield: "3,200 kWh" },
              { month: "March", yield: "4,100 kWh" },
              { month: "April", yield: "4,600 kWh" },
              { month: "May", yield: "5,200 kWh" },
              { month: "June", yield: "5,400 kWh" },
              { month: "July", yield: "5,600 kWh" },
              { month: "August", yield: "5,300 kWh" },
              { month: "September", yield: "4,800 kWh" },
              { month: "October", yield: "3,900 kWh" },
              { month: "November", yield: "3,100 kWh" },
              { month: "December", yield: "2,650 kWh" },
            ].map((item) => (
              <div
                key={item.month}
                className="flex justify-between items-center p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors"
              >
                <span className="font-medium">{item.month}</span>
                <span className="text-primary font-semibold">{item.yield}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}