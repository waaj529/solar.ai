import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../shared/ui/table";
import { Alert, AlertDescription, AlertTitle } from "../../shared/ui/alert";
import { getLoadAnalysis } from "../../lib/api";
import { Button } from "../../shared/ui/button";
import { Skeleton } from "../../shared/ui/skeleton";
import { useMobile } from "../../shared/hooks/use-mobile";

type LoadAnalysisData = {
  _id?: string;
  user_id?: string;
  nlp_id?: string;
  analysisSummary?: {
    totalDailyEnergyConsumption_kWh?: number;
    peakContinuousLoad_kW?: number;
    estimatedSurgeLoad_kW?: number;
    notes?: string;
  };
  detailedLoadList?: Array<Record<string, unknown>>;
  preliminarySizingRecommendations?: {
    inverter?: { continuousPower_kW?: number; surgePower_kW?: number; notes?: string };
    batteryBank?: { totalCapacity_kWh?: number; usableCapacity_kWh?: number; notes?: string };
    pvArray?: { requiredPower_kWp?: number; notes?: string };
  };
  created_at?: string;
};

export function LoadAnalysis() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<LoadAnalysisData | null>(null);
  const pollTimerRef = useRef<number | null>(null);
  const [polling, setPolling] = useState(false);
  const isMobile = useMobile();

  useEffect(() => {
    const userId = localStorage.getItem('encrypted_user_id') || localStorage.getItem('anon_user_id') || '';
    const loadId = localStorage.getItem('latest_load_id') || '';
    if (!userId || !loadId) return;

    let cancelled = false;

    const POLL_INTERVAL_MS = parseInt(import.meta.env.VITE_LOAD_POLL_INTERVAL_MS || '3000');
    const MAX_ATTEMPTS = parseInt(import.meta.env.VITE_LOAD_POLL_MAX_ATTEMPTS || '20');
    let attempts = 0;

    const fetchOnce = async () => {
      setPolling(true);
      setLoading(true);
      setError(null);
      try {
        const raw = await getLoadAnalysis({ user_id: userId, load_id: loadId });
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.log('LoadAnalysis GET raw →', raw);
        }
        const normalized = (raw as any)?.data ?? (raw as any) ?? null;
        const hasContent = !!normalized && (
          !!normalized?.analysisSummary || Array.isArray(normalized?.detailedLoadList)
        );
        if (!cancelled) {
          if (hasContent) {
            setData(normalized as LoadAnalysisData);
            if (pollTimerRef.current) window.clearTimeout(pollTimerRef.current);
            pollTimerRef.current = null;
            setPolling(false);
          } else if (attempts < MAX_ATTEMPTS) {
            attempts += 1;
            pollTimerRef.current = window.setTimeout(fetchOnce, POLL_INTERVAL_MS);
          } else {
            setError('No analysis data available yet. Please try again shortly.');
            setPolling(false);
          }
        }
      } catch (e: any) {
        if (!cancelled) {
          if (attempts < MAX_ATTEMPTS) {
            attempts += 1;
            pollTimerRef.current = window.setTimeout(fetchOnce, POLL_INTERVAL_MS);
          } else {
            setError(e?.message || 'Failed to fetch load analysis');
            setPolling(false);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchOnce();

    return () => {
      cancelled = true;
      if (pollTimerRef.current) window.clearTimeout(pollTimerRef.current);
    };
  }, []);

  const summary = data?.analysisSummary ?? {};
  const sizing = data?.preliminarySizingRecommendations ?? {} as LoadAnalysisData["preliminarySizingRecommendations"];
  const list = Array.isArray(data?.detailedLoadList) ? (data?.detailedLoadList as Array<Record<string, unknown>>) : [];

  const formatNum = (value: unknown, unit?: string) => {
    if (typeof value === 'number' && !Number.isNaN(value)) {
      const val = Math.abs(value) >= 100 ? value.toFixed(0) : value.toFixed(2);
      return unit ? `${val} ${unit}` : val;
    }
    if (typeof value === 'string' && value.trim().length > 0) return unit ? `${value} ${unit}` : value;
    return '—';
  };

  const tableColumns = useMemo(() => {
    if (!list.length) return [] as string[];
    const keys = Object.keys(list[0] ?? {});
    // Put common keys first if present
    const preferred = ['appliance', 'quantity', 'powerRating_W', 'dailyOperatingHours', 'dailyEnergy_Wh', 'power_watts', 'hours_per_day', 'energy_kwh'];
    const ordered = [
      ...preferred.filter((k) => keys.includes(k)),
      ...keys.filter((k) => !preferred.includes(k)),
    ];
    return ordered;
  }, [list]);

  const labelMap: Record<string, string> = {
    appliance: 'Appliance',
    power_watts: 'Power (W)',
    hours_per_day: 'Hours/Day',
    energy_kwh: 'Daily Energy (kWh)',
    quantity: 'Quantity',
    powerRating_W: 'Power (W)',
    dailyOperatingHours: 'Hours/Day',
    dailyEnergy_Wh: 'Daily Energy (Wh)',
    isMotorLoad: 'Motor Load',
  };

  // Note: reserved for future row mapping if server sends variant keys
  void isMobile;

  const userId = typeof window !== 'undefined' ? (localStorage.getItem('encrypted_user_id') || localStorage.getItem('anon_user_id') || '') : '';
  const loadId = typeof window !== 'undefined' ? (localStorage.getItem('latest_load_id') || '') : '';

  const refresh = () => {
    // Force a new polling cycle
    if (pollTimerRef.current) window.clearTimeout(pollTimerRef.current);
    pollTimerRef.current = null;
    setError(null);
    setData(null);
    // Re-run the effect body logic by calling fetch once directly
    // Minimal duplication: mimic one-shot fetch
    (async () => {
      try {
        setLoading(true);
        const raw = await getLoadAnalysis({ user_id: userId, load_id: loadId });
        const normalized = (raw as any)?.data ?? (raw as any) ?? null;
        setData(normalized as LoadAnalysisData);
      } catch (e: any) {
        setError(e?.message || 'Failed to fetch load analysis');
      } finally {
        setLoading(false);
      }
    })();
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Hero section - responsive typography */}
      <div className="max-w-3xl">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-2 sm:mb-3">
          <span className="text-primary">Load Analysis</span>
          <span className="text-secondary"> &amp; System Sizing</span>
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
          Comprehensive analysis of your energy requirements and preliminary sizing
          recommendations generated from your inputs.
        </p>
      </div>

      {/* Summary controls */}
      <div className="flex items-center justify-end gap-2">
        <Button size="sm" onClick={refresh} disabled={polling}>{polling ? 'Loading…' : 'Refresh'}</Button>
      </div>

      {/* Summary cards - responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-primary text-sm sm:text-base">Peak Continuous Load</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {loading && !data ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold">{formatNum(summary.peakContinuousLoad_kW, 'kW')}</div>
            )}
            <p className="text-xs sm:text-sm text-muted-foreground">Maximum continuous demand</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-primary text-sm sm:text-base">Daily Consumption</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {loading && !data ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold">{formatNum(summary.totalDailyEnergyConsumption_kWh, 'kWh')}</div>
            )}
            <p className="text-xs sm:text-sm text-muted-foreground">Estimated total daily energy</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-primary text-sm sm:text-base">PV Array Size</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {loading && !data ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold">{formatNum(sizing?.pvArray?.requiredPower_kWp, 'kWp')}</div>
            )}
            <p className="text-xs sm:text-sm text-muted-foreground">Recommended array power</p>
          </CardContent>
        </Card>
      </div>

      {/* Analysis notes */}
      {(summary?.notes || error) && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertTitle className="text-yellow-800 flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-yellow-500" />
            Analysis Notes
          </AlertTitle>
          <AlertDescription className="text-yellow-900">
            {error ? error : summary?.notes}
          </AlertDescription>
        </Alert>
      )}

      {/* Sizing recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-primary text-sm sm:text-base">Inverter</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-1 text-sm">
            <div className="flex items-center justify-between">
              <span>Continuous Power</span>
              <span className="font-semibold">{formatNum(sizing?.inverter?.continuousPower_kW, 'kW')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Surge Power</span>
              <span className="font-semibold">{formatNum(sizing?.inverter?.surgePower_kW, 'kW')}</span>
            </div>
            {sizing?.inverter?.notes && (
              <p className="text-xs text-muted-foreground mt-2">{sizing.inverter.notes}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-primary text-sm sm:text-base">Battery Bank</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-1 text-sm">
            <div className="flex items-center justify-between">
              <span>Total Capacity</span>
              <span className="font-semibold">{formatNum(sizing?.batteryBank?.totalCapacity_kWh, 'kWh')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Usable Capacity</span>
              <span className="font-semibold">{formatNum(sizing?.batteryBank?.usableCapacity_kWh, 'kWh')}</span>
            </div>
            {sizing?.batteryBank?.notes && (
              <p className="text-xs text-muted-foreground mt-2">{sizing.batteryBank.notes}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-primary text-sm sm:text-base">PV Array</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-1 text-sm">
            <div className="flex items-center justify-between">
              <span>Required Power</span>
              <span className="font-semibold">{formatNum(sizing?.pvArray?.requiredPower_kWp, 'kWp')}</span>
            </div>
            {sizing?.pvArray?.notes && (
              <p className="text-xs text-muted-foreground mt-2">{sizing.pvArray.notes}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed load list */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2 sm:pb-3">
          <CardTitle className="text-foreground text-base sm:text-lg">Detailed Load List</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {loading && (
            <div className="space-y-3">
              <Skeleton className="h-4 w-24 sm:w-1/3" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-2/3" />
            </div>
          )}
          {error && <div className="text-sm text-red-600">{error}</div>}
          {!loading && !error && (
            <>
              {list.length === 0 ? (
                <div className="text-sm text-muted-foreground">No appliance-level data provided.</div>
              ) : (
                <Table className="text-xs sm:text-sm">
                  <TableHeader>
                    <TableRow>
                      {tableColumns.map((col) => (
                        <TableHead key={col} className="capitalize whitespace-nowrap">
                          {labelMap[col] || col.replace(/_/g, ' ')}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {list.map((row, idx) => (
                      <TableRow key={idx}>
                        {tableColumns.map((col) => (
                          <TableCell key={col} className="whitespace-nowrap">
                            {String((row as any)[col] ?? '—')}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}