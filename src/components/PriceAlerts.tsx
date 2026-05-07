'use client';

import { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, BellRing } from 'lucide-react';
import { getTokenPrice } from '@/lib/birdeye';

interface Alert {
  id: string;
  symbol: string;
  address: string;
  targetPrice: number;
  condition: 'above' | 'below';
  triggered: boolean;
  createdAt: number;
}

const POPULAR_TOKENS = [
  { symbol: 'SOL', address: 'So11111111111111111111111111111111111111112' },
  { symbol: 'USDC', address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' },
  { symbol: 'BONK', address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263' },
  { symbol: 'JTO', address: 'jtojtomepa8berqQfDqoh8QY7KRM3bkdnUXkbgdNjt' },
  { symbol: 'WIF', address: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm' },
];

export default function PriceAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedToken, setSelectedToken] = useState(POPULAR_TOKENS[0]);
  const [targetPrice, setTargetPrice] = useState('');
  const [condition, setCondition] = useState<'above' | 'below'>('above');
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [triggered, setTriggered] = useState<Alert[]>([]);

  useEffect(() => {
  try {
    const saved = localStorage.getItem('solsense_alerts');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Reset triggered alerts older than 24h so they can re-trigger
      const reset = parsed.map((a: Alert) => ({
        ...a,
        triggered: a.triggered && (Date.now() - a.createdAt < 86400000) ? true : false
      }));
      setAlerts(reset);
    }
  } catch {
    localStorage.removeItem('solsense_alerts');
  }
}, []);

  useEffect(() => {
    if (alerts.length === 0) return;
    const interval = setInterval(checkAlerts, 15000);
    checkAlerts();
    return () => clearInterval(interval);
  }, [alerts]);

  useEffect(() => {
    if (selectedToken) fetchCurrentPrice();
  }, [selectedToken]);

  async function fetchCurrentPrice() {
    const data = await getTokenPrice(selectedToken.address);
    if (data?.data?.value) setCurrentPrice(data.data.value);
  }

  async function checkAlerts() {
    const newTriggered: Alert[] = [];
    for (const alert of alerts) {
      if (alert.triggered) continue;
      const data = await getTokenPrice(alert.address);
      const price = data?.data?.value;
      if (!price) continue;
      const hit = alert.condition === 'above' ? price >= alert.targetPrice : price <= alert.targetPrice;
      if (hit) {
        newTriggered.push(alert);
        if (Notification.permission === 'granted') {
          new Notification(`🚨 SolSense Alert: ${alert.symbol}`, {
            body: `${alert.symbol} is now ${alert.condition} $${alert.targetPrice}! Current: $${price.toFixed(4)}`,
            icon: '/favicon.ico',
          });
        }
      }
    }
    if (newTriggered.length > 0) {
      const updated = alerts.map(a =>
        newTriggered.find(t => t.id === a.id) ? { ...a, triggered: true } : a
      );
      setAlerts(updated);
      setTriggered(prev => [...prev, ...newTriggered]);
      localStorage.setItem('solsense_alerts', JSON.stringify(updated));
    }
  }

  function addAlert() {
    if (!targetPrice || isNaN(Number(targetPrice))) return;
    const newAlert: Alert = {
      id: Date.now().toString(),
      symbol: selectedToken.symbol,
      address: selectedToken.address,
      targetPrice: Number(targetPrice),
      condition,
      triggered: false,
      createdAt: Date.now(),
    };
    const updated = [...alerts, newAlert];
    setAlerts(updated);
    localStorage.setItem('solsense_alerts', JSON.stringify(updated));
    setTargetPrice('');
    setShowForm(false);
  }

  function removeAlert(id: string) {
    const updated = alerts.filter(a => a.id !== id);
    setAlerts(updated);
    localStorage.setItem('solsense_alerts', JSON.stringify(updated));
  }

  async function requestNotifications() {
    await Notification.requestPermission();
  }

  return (
    <div className="rounded-2xl backdrop-blur-sm"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="flex items-center justify-between p-5 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        <h2 className="font-bold flex items-center gap-2">
          <Bell size={16} className="text-yellow-400" /> Price Alerts
        </h2>
        <div className="flex gap-2">
          {Notification.permission !== 'granted' && (
            <button onClick={requestNotifications}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs"
              style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}>
              <BellRing size={12} /> Enable Notifications
            </button>
          )}
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-white"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
            <Plus size={12} /> Add Alert
          </button>
        </div>
      </div>

      {showForm && (
        <div className="p-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Token</label>
              <select
                value={selectedToken.symbol}
                onChange={(e) => setSelectedToken(POPULAR_TOKENS.find(t => t.symbol === e.target.value) || POPULAR_TOKENS[0])}
                className="w-full px-3 py-2 rounded-lg text-sm text-white"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
                {POPULAR_TOKENS.map(t => <option key={t.symbol} value={t.symbol}>{t.symbol}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as 'above' | 'below')}
                className="w-full px-3 py-2 rounded-lg text-sm text-white"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <option value="above">Price goes above</option>
                <option value="below">Price goes below</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">
                Target Price {currentPrice && <span className="text-purple-400">(now: ${currentPrice.toFixed(4)})</span>}
              </label>
              <input
                type="number"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 rounded-lg text-sm text-white"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>
          </div>
          <button onClick={addAlert}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
            Create Alert
          </button>
        </div>
      )}

      <div className="p-3">
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Bell size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No alerts set</p>
            <p className="text-xs mt-1">Add alerts to get notified of price movements</p>
          </div>
        ) : (
          <div className="space-y-2">
            {alerts.map((alert) => (
              <div key={alert.id}
                className="flex items-center justify-between px-4 py-3 rounded-xl"
                style={{
                  background: alert.triggered ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${alert.triggered ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.06)'}`,
                }}>
                <div className="flex items-center gap-3">
                  <span className={`text-lg ${alert.triggered ? '' : 'opacity-50'}`}>
                    {alert.triggered ? '✅' : '⏳'}
                  </span>
                  <div>
                    <div className="text-sm font-semibold">
                      {alert.symbol} {alert.condition === 'above' ? '≥' : '≤'} ${alert.targetPrice}
                    </div>
                    <div className="text-xs text-gray-500">
                      {alert.triggered ? '🔔 Triggered!' : `Alert when price goes ${alert.condition} $${alert.targetPrice}`}
                    </div>
                  </div>
                </div>
                <button onClick={() => removeAlert(alert.id)}
                  className="text-gray-600 hover:text-red-400 transition-colors p-1">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {alerts.length > 0 && (
        <div className="px-5 pb-4 flex gap-2">
          <button
            onClick={() => {
              const data = JSON.stringify(alerts, null, 2);
              const blob = new Blob([data], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'solsense_alerts.json';
              a.click();
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white"
            style={{ background: 'rgba(255,255,255,0.06)' }}>
            📥 Export Alerts
          </button>
          <button
            onClick={() => {
              setAlerts([]);
              localStorage.removeItem('solsense_alerts');
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-red-400 hover:text-red-300"
            style={{ background: 'rgba(239,68,68,0.08)' }}>
            🗑️ Clear All
          </button>
        </div>
      )}
    </div>
  );
}