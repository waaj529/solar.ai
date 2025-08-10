import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Alert, AlertDescription } from "../../shared/ui/alert";
import { Skeleton } from "../../shared/ui/skeleton";
import { combineDataByDocId, getLoadAnalysis, getWeatherByDocId } from "../../lib/api";
import { Button } from "../../shared/ui/button";

// Simple in-memory cache to persist Solar Yield data while the tab remains open.
// This avoids refetching when switching between modules.
type SolarYieldCache = {
  kpis: {
    annual: number;
    monthlyAvg: number;
    avgDaily: number;
    dailyConsumption: number;
    surplusDaily: number;
    efficiencyPct: number;
    location?: string;
  } | null;
  monthly: Array<{ month: string; value: number }>;
  monthlyDetail: Array<{ month: string; days?: number; daily: number; monthly: number }>;
  psh: Array<{ month: string; value: number }>;
  assumptions: {
    deratePct?: number;
    inverterEffPct?: number;
    batteryRtePct?: number;
    batteryDodPct?: number;
    panelPowerStandard?: string;
    assumptionNotes?: string;
  } | null;
  annualNotes?: string;
  impl: { panelCountEstimate?: string; actions?: string[] } | null;
  docId?: string;
  insertedId?: string;
} | null;

let cachedSolarYield: SolarYieldCache = null;

export function SolarYield() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // no weather state kept; we read and map immediately into KPIs and monthly values
  const [kpis, setKpis] = useState<{
    annual: number;
    monthlyAvg: number;
    avgDaily: number;
    dailyConsumption: number;
    surplusDaily: number;
    efficiencyPct: number;
    location?: string;
  } | null>(cachedSolarYield?.kpis ?? null);
  const [monthly, setMonthly] = useState<Array<{ month: string; value: number }>>(cachedSolarYield?.monthly ?? []);
  const [monthlyDetail, setMonthlyDetail] = useState<Array<{ month: string; days?: number; daily: number; monthly: number }>>(cachedSolarYield?.monthlyDetail ?? []);
  const [psh, setPsh] = useState<Array<{ month: string; value: number }>>(cachedSolarYield?.psh ?? []);
  const [assumptions, setAssumptions] = useState<{
    deratePct?: number;
    inverterEffPct?: number;
    batteryRtePct?: number;
    batteryDodPct?: number;
    panelPowerStandard?: string;
    assumptionNotes?: string;
  } | null>(cachedSolarYield?.assumptions ?? null);
  const [annualNotes, setAnnualNotes] = useState<string | undefined>(cachedSolarYield?.annualNotes ?? undefined);
  const [impl, setImpl] = useState<{ panelCountEstimate?: string; actions?: string[] } | null>(cachedSolarYield?.impl ?? null);

  // Typography helpers to keep KPI text from overflowing cards on wide screens
  const formatValueOnly = (value: unknown) => {
    if (typeof value === 'number' && !Number.isNaN(value)) {
      if (Math.abs(value) >= 1000) return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
      if (Math.abs(value) >= 100) return value.toFixed(0);
      return value.toFixed(2);
    }
    if (typeof value === 'string' && value.trim().length > 0) return value;
    return '—';
  };
  const renderMetric = (value: unknown, unit?: string, valueClassName?: string) => (
    <div className="flex flex-wrap items-baseline gap-1 w-full">
      <span
        className={`font-bold leading-tight text-xl sm:text-2xl md:text-2xl lg:text-3xl ${valueClassName ?? ''}`}
      >
        {formatValueOnly(value)}
      </span>
      {unit ? (
        <span className="text-xs sm:text-sm text-muted-foreground">{unit}</span>
      ) : null}
    </div>
  );

  const fetchAll = async (force?: boolean) => {
    let docIdFromLoad: string | undefined = undefined;
    let insertedIdFromCombine: string | undefined = undefined;
    try {
      setLoading(true);
      setError(null);

      const userId = localStorage.getItem('encrypted_user_id') || localStorage.getItem('anon_user_id') || '';
      const loadId = localStorage.getItem('latest_load_id') || '';
      if (!userId || !loadId) {
        setError('Missing user or load identifier. Please complete Load Analysis first.');
        return;
      }

      // 1) Resolve doc id (reuse if we have it and not forcing)
      let docId = (!force ? localStorage.getItem('latest_load_doc_id') : undefined) || undefined;
      if (!docId) {
        const raw = await getLoadAnalysis({ user_id: userId, load_id: loadId });
        const la = (raw as any)?.data ?? (raw as any) ?? null;
        docId = (la?._id || la?.id) as string | undefined;
        if (!docId) {
          setError('Could not resolve document id from Load Analysis response.');
          return;
        }
        localStorage.setItem('latest_load_doc_id', String(docId));
      }
      docIdFromLoad = String(docId);

      // 2) Get combined data id (reuse if available and not forcing)
      let insertedId = (!force ? localStorage.getItem('latest_weather_doc_id') : undefined) || undefined;
      if (!insertedId) {
        const combine = await combineDataByDocId(String(docId));
        insertedId = (combine as any)?.inserted_id || (combine as any)?.data?.inserted_id;
        if (!insertedId) {
          setError('Combine Data did not return an inserted_id.');
          return;
        }
        localStorage.setItem('latest_weather_doc_id', String(insertedId));
      }
      insertedIdFromCombine = String(insertedId);

      const weatherRes = await getWeatherByDocId(String(insertedId));
      // Map KPIs directly from response
      const annual = Number(weatherRes?.annualSummary?.annual_kWh_from_PV ?? 0);
      const monthlyAvg = Number(((weatherRes?.annualSummary?.annual_kWh_from_PV ?? 0) as number) / 12);
      const avgDaily = Number(weatherRes?.annualSummary?.average_daily_kWh_from_PV ?? 0);
      const dailyConsumption = Number(weatherRes?.annualSummary?.daily_consumption_kWh ?? 0);
      const surplusDaily = Number(weatherRes?.annualSummary?.surplus_or_deficit_daily_kWh ?? 0);
      const derate = (weatherRes?.systemAssumptions as any)?.pv_system_derate_percent ?? 0;
      const efficiencyPct = Number(100 - Number(derate));
      const location = (weatherRes?.systemAssumptions as any)?.location as string | undefined;
      const nextKpis = { annual, monthlyAvg, avgDaily, dailyConsumption, surplusDaily, efficiencyPct, location };
      setKpis(nextKpis);

      const gen = Array.isArray(weatherRes?.monthlyGeneration_kWh)
        ? (weatherRes?.monthlyGeneration_kWh as Array<{ month: string; days?: number; daily_kWh_from_PV?: number; monthly_kWh_from_PV?: number }>)
        : [];
      const nextMonthly = gen.map((m) => ({ month: String(m.month), value: Number(m.monthly_kWh_from_PV ?? 0) }));
      const nextMonthlyDetail = gen.map((m) => ({ month: String(m.month), days: m.days, daily: Number(m.daily_kWh_from_PV ?? 0), monthly: Number(m.monthly_kWh_from_PV ?? 0) }));
      setMonthly(nextMonthly);
      setMonthlyDetail(nextMonthlyDetail);

      const pshMap = (weatherRes?.systemAssumptions?.peakSunHours_monthly_used_for_estimate || {}) as Record<string, number>;
      const monthNames: Array<[string, string]> = [
        ['Jan','January'],['Feb','February'],['Mar','March'],['Apr','April'],['May','May'],['Jun','June'],
        ['Jul','July'],['Aug','August'],['Sep','September'],['Oct','October'],['Nov','November'],['Dec','December']
      ];
      const nextPsh = monthNames.map(([k, full]) => ({ month: full, value: Number(pshMap?.[k] ?? 0) }));
      setPsh(nextPsh);

      const nextAssumptions = {
        deratePct: Number((weatherRes?.systemAssumptions as any)?.pv_system_derate_percent ?? 0),
        inverterEffPct: Number((weatherRes?.systemAssumptions as any)?.inverter_efficiency_percent ?? 0),
        batteryRtePct: Number((weatherRes?.systemAssumptions as any)?.battery_round_trip_efficiency_percent ?? 0),
        batteryDodPct: Number((weatherRes?.systemAssumptions as any)?.battery_depth_of_discharge_percent ?? 0),
        panelPowerStandard: (weatherRes?.systemAssumptions as any)?.panel_power_standard,
        assumptionNotes: (weatherRes?.systemAssumptions as any)?.notes,
      } as typeof assumptions;
      setAssumptions(nextAssumptions);

      const nextAnnualNotes = (weatherRes?.annualSummary as any)?.notes as string | undefined;
      setAnnualNotes(nextAnnualNotes);

      const implNotes = (weatherRes as any)?.implementationNotes || {};
      const nextImpl = {
        panelCountEstimate: implNotes?.panel_count_estimate,
        actions: Array.isArray(implNotes?.recommended_actions) ? (implNotes.recommended_actions as string[]) : [],
      } as typeof impl;
      setImpl(nextImpl);

      // Save to in-memory cache so navigating away and back does not refetch
      cachedSolarYield = {
        kpis: nextKpis,
        monthly: nextMonthly,
        monthlyDetail: nextMonthlyDetail,
        psh: nextPsh,
        assumptions: nextAssumptions,
        annualNotes: nextAnnualNotes,
        impl: nextImpl,
        docId: docIdFromLoad,
        insertedId: insertedIdFromCombine,
      };
    } catch (e: any) {
      setError(e?.message || 'Failed to prepare Solar Yield inputs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        if (cachedSolarYield) {
          // Hydrate from cache if available
          if (cachedSolarYield.kpis) setKpis(cachedSolarYield.kpis);
          setMonthly(cachedSolarYield.monthly || []);
          setMonthlyDetail(cachedSolarYield.monthlyDetail || []);
          setPsh(cachedSolarYield.psh || []);
          setAssumptions(cachedSolarYield.assumptions || null);
          setAnnualNotes(cachedSolarYield.annualNotes);
          setImpl(cachedSolarYield.impl || null);
          return;
        }
        await fetchAll(false);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to prepare Solar Yield inputs.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const refresh = async () => {
    if (loading) return;
    // Do not clear existing UI; just fetch and then replace state + cache
    cachedSolarYield = null;
    await fetchAll(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Hero section */}
      <div className="max-w-3xl">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-2 sm:mb-3">
          <span className="text-primary">Solar Yield</span>
          <span className="text-secondary"> Estimation</span>
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
          Estimated solar energy generation based on location and system specifications{kpis?.location ? ` • ${kpis.location}` : ''}.
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-end gap-2">
        <Button size="sm" onClick={refresh} disabled={loading}>{loading ? 'Loading…' : 'Refresh'}</Button>
      </div>

      {/* Any server messages */}
      {error && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertDescription className="text-yellow-900">{error}</AlertDescription>
        </Alert>
      )}

      {/* Statistic cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 2xl:grid-cols-6 gap-4 sm:gap-6 items-stretch">
        <Card className="min-w-0 h-full flex flex-col hover:shadow-lg transition-shadow col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-primary">Annual Yield</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between gap-1 sm:gap-2">
            {loading ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              renderMetric(kpis ? kpis.annual : null, 'kWh')
            )}
            <p className="text-sm text-muted-foreground">Per year</p>
          </CardContent>
        </Card>
        <Card className="min-w-0 h-full flex flex-col hover:shadow-lg transition-shadow col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-primary">Monthly Average</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between gap-1 sm:gap-2">
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              renderMetric(kpis ? kpis.monthlyAvg : null, 'kWh')
            )}
            <p className="text-sm text-muted-foreground">Per month</p>
          </CardContent>
        </Card>
        <Card className="min-w-0 h-full flex flex-col hover:shadow-lg transition-shadow col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-primary">Average Daily Generation</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between gap-1 sm:gap-2">
            {loading ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              renderMetric(kpis ? kpis.avgDaily : null, 'kWh/day')
            )}
            <p className="text-sm text-muted-foreground">From PV</p>
          </CardContent>
        </Card>
        <Card className="min-w-0 h-full flex flex-col hover:shadow-lg transition-shadow col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-primary">Daily Consumption</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between gap-1 sm:gap-2">
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              renderMetric(kpis ? kpis.dailyConsumption : null, 'kWh/day')
            )}
            <p className="text-sm text-muted-foreground">Load</p>
          </CardContent>
        </Card>
        <Card className="min-w-0 h-full flex flex-col hover:shadow-lg transition-shadow col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-primary">Surplus / Deficit</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between gap-1 sm:gap-2">
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              renderMetric(
                kpis ? kpis.surplusDaily : null,
                'kWh/day',
                kpis && kpis.surplusDaily < 0 ? 'text-red-600' : 'text-foreground'
              )
            )}
            <p className="text-sm text-muted-foreground">PV − Consumption</p>
          </CardContent>
        </Card>
        <Card className="min-w-0 h-full flex flex-col hover:shadow-lg transition-shadow col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-primary">Efficiency</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between gap-1 sm:gap-2 min-w-0">
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              renderMetric(kpis ? kpis.efficiencyPct : null, '%')
            )}
            <p className="text-sm text-muted-foreground">System efficiency</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly estimates */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-foreground">Monthly Solar Generation Estimate</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="h-10" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {monthly.map((item) => (
                <div
                  key={item.month}
                  className="flex justify-between items-center p-2 sm:p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors"
                >
                  <span className="font-medium">{item.month}</span>
                  <span className="text-primary font-semibold">{item.value.toFixed(2)} kWh</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed monthly breakdown (days + daily PV) */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-foreground">Monthly Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {monthlyDetail.map((m) => (
              <div key={m.month} className="p-2 sm:p-3 rounded-lg border bg-white">
                <div className="font-medium mb-1">{m.month}</div>
                <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
                  <span>Days</span>
                  <span className="text-foreground font-medium">{m.days ?? '—'}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
                  <span>Daily from PV</span>
                  <span className="text-foreground font-medium">{m.daily.toFixed(2)} kWh</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
                  <span>Monthly from PV</span>
                  <span className="text-foreground font-medium">{m.monthly.toFixed(2)} kWh</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Peak Sun Hours used for estimate */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-foreground">Peak Sun Hours (Monthly)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {psh.map((p) => (
              <div key={p.month} className="flex justify-between items-center p-2 sm:p-3 rounded-lg bg-primary/5">
                <span className="font-medium">{p.month}</span>
                <span className="text-primary font-semibold">{p.value.toFixed(1)} h</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System assumptions & notes */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-foreground">System Assumptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 rounded-lg border bg-white">
              <div className="text-sm text-muted-foreground">PV System Derate</div>
              <div className="text-xl font-semibold">{assumptions ? `${assumptions.deratePct?.toFixed(0)}%` : '—'}</div>
            </div>
            <div className="p-2 sm:p-3 rounded-lg border bg-white">
              <div className="text-sm text-muted-foreground">Inverter Efficiency</div>
              <div className="text-xl font-semibold">{assumptions ? `${assumptions.inverterEffPct?.toFixed(0)}%` : '—'}</div>
            </div>
            <div className="p-2 sm:p-3 rounded-lg border bg-white">
              <div className="text-sm text-muted-foreground">Battery Round-trip Efficiency</div>
              <div className="text-xl font-semibold">{assumptions ? `${assumptions.batteryRtePct?.toFixed(0)}%` : '—'}</div>
            </div>
            <div className="p-2 sm:p-3 rounded-lg border bg-white">
              <div className="text-sm text-muted-foreground">Battery Depth of Discharge</div>
              <div className="text-xl font-semibold">{assumptions ? `${assumptions.batteryDodPct?.toFixed(0)}%` : '—'}</div>
            </div>
            <div className="p-2 sm:p-3 rounded-lg border bg-white sm:col-span-2 lg:col-span-2">
              <div className="text-sm text-muted-foreground">Panel Power Standard</div>
              <div className="text-base font-medium">{assumptions?.panelPowerStandard || '—'}</div>
            </div>
          </div>
          {assumptions?.assumptionNotes && (
            <p className="text-xs sm:text-sm text-muted-foreground mt-3 sm:mt-4">{assumptions.assumptionNotes}</p>
          )}
        </CardContent>
      </Card>

      {/* Annual notes and implementation guidance */}
      {(annualNotes || impl) && (
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-foreground">Notes & Implementation Guidance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            {annualNotes && <p className="text-xs sm:text-sm text-muted-foreground">{annualNotes}</p>}
            {impl && (
              <div className="space-y-2">
                {impl.panelCountEstimate && (
                  <div>
                    <div className="text-sm text-muted-foreground">Panel Count Estimate</div>
                    <div className="text-base font-medium">{impl.panelCountEstimate}</div>
                  </div>
                )}
                {Array.isArray(impl.actions) && impl.actions.length > 0 && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Recommended Actions</div>
                    <ul className="list-disc ml-5 sm:ml-6 text-xs sm:text-sm space-y-1">
                      {impl.actions.map((a, idx) => (
                        <li key={idx}>{a}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}