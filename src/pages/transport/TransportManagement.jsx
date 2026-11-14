import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Tabs } from '../../components/common/Tabs';
import { Modal } from '../../components/common/Modal';
import { Input, Select } from '../../components/common/Input';
import { formatCurrency } from '../../lib/utils';
import {
  Bus,
  MapPin,
  Clock,
  Phone,
  Plus,
  Users,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

export const TransportManagement = () => {
  const { vehicles, routes, addVehicle, addRoute } = useData();
  const { success } = useToast();

  const [activeTab, setActiveTab] = useState('routes'); // 'routes' | 'fleet'
  const [addVehOpen, setAddVehOpen] = useState(false);
  const [addRouteOpen, setAddRouteOpen] = useState(false);

  // New vehicle form
  const [vehNum, setVehNum] = useState('');
  const [vehModel, setVehModel] = useState('');
  const [vehCapacity, setVehCapacity] = useState('44');
  const [vehDriver, setVehDriver] = useState('');
  const [vehPhone, setVehPhone] = useState('');

  // New route form
  const [routeName, setRouteName] = useState('');
  const [routeStart, setRouteStart] = useState('');
  const [routeEnd, setRouteEnd] = useState('Oakridge Main Campus');
  const [routePickup, setRoutePickup] = useState('07:20 AM');
  const [routeDrop, setRouteDrop] = useState('04:20 PM');
  const [routeFee, setRouteFee] = useState('750');

  const handleCreateVehicle = (e) => {
    e.preventDefault();
    if (!vehNum || !vehDriver) return;

    addVehicle({
      vehicle_number: vehNum,
      vehicle_model: vehModel || 'School Bus',
      capacity: Number(vehCapacity),
      driver_name: vehDriver,
      driver_license: `DL-CA-${Math.floor(100000 + Math.random() * 900000)}`,
      driver_phone: vehPhone,
    });

    success(`Vehicle ${vehNum} added to fleet!`);
    setAddVehOpen(false);
    setVehNum('');
  };

  const handleCreateRoute = (e) => {
    e.preventDefault();
    if (!routeName || !routeStart) return;

    addRoute({
      route_name: routeName,
      start_point: routeStart,
      end_point: routeEnd,
      pickup_time: routePickup,
      drop_time: routeDrop,
      fee_per_term: Number(routeFee),
      stops: [
        { name: routeStart, time: routePickup },
        { name: routeEnd, time: '08:15 AM' },
      ],
    });

    success(`Route "${routeName}" created!`);
    setAddRouteOpen(false);
    setRouteName('');
  };

  const tabs = [
    { id: 'routes', label: 'Transit Routes & Bus Stops', icon: MapPin, badge: routes.length },
    { id: 'fleet', label: 'School Bus Fleet & Drivers', icon: Bus, badge: vehicles.length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            School Transport & Bus Fleet
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Vehicle registration, licensed driver dispatch, corridor routes, and bus stop tracking.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            icon={Plus}
            onClick={() => setAddVehOpen(true)}
          >
            Add Vehicle
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setAddRouteOpen(true)}
          >
            Create Route
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'routes' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {routes.map((rt) => (
              <div
                key={rt.id}
                className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-slate-900">{rt.route_name}</span>
                  <Badge variant="primary" size="sm">
                    {formatCurrency(rt.fee_per_term)} / Term
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 my-2">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-brand-600" />
                    Pickup: {rt.pickup_time}
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    Drop: {rt.drop_time}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-2">
                    Designated Bus Stops & Timings:
                  </span>
                  <div className="space-y-2">
                    {rt.stops &&
                      rt.stops.map((st, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 border border-slate-100"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 font-bold text-[10px] flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="font-semibold text-slate-800">{st.name}</span>
                          </div>
                          <span className="font-mono text-slate-600">{st.time}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'fleet' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((veh) => (
            <div
              key={veh.id}
              className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                  {veh.vehicle_number}
                </span>
                <Badge variant={veh.status === 'active' ? 'success' : 'warning'} size="sm" dot>
                  {veh.status}
                </Badge>
              </div>

              <h3 className="text-sm font-bold text-slate-900">{veh.vehicle_model}</h3>
              <p className="text-xs text-slate-500 mt-0.5">Capacity: {veh.capacity} Passengers</p>

              <div className="mt-4 pt-3 border-t border-slate-100 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Assigned Driver:</span>
                  <span className="font-bold text-slate-800">{veh.driver_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Driver Phone:</span>
                  <span className="font-semibold text-brand-600">{veh.driver_phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Driver License:</span>
                  <span className="font-mono text-slate-600 text-[11px]">{veh.driver_license}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Vehicle Modal */}
      <Modal
        isOpen={addVehOpen}
        onClose={() => setAddVehOpen(false)}
        title="Register Fleet Vehicle"
        subtitle="Add school bus and allocate driver details"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateVehicle} className="space-y-4">
          <Input
            label="Vehicle Plate Number"
            required
            value={vehNum}
            onChange={(e) => setVehNum(e.target.value)}
            placeholder="e.g. BUS-OIA-04"
          />
          <Input
            label="Model / Make"
            value={vehModel}
            onChange={(e) => setVehModel(e.target.value)}
            placeholder="e.g. Blue Bird Vision 2023"
          />
          <Input
            label="Passenger Capacity"
            type="number"
            value={vehCapacity}
            onChange={(e) => setVehCapacity(e.target.value)}
          />
          <Input
            label="Driver Full Name"
            required
            value={vehDriver}
            onChange={(e) => setVehDriver(e.target.value)}
            placeholder="e.g. Hector Salamanca"
          />
          <Input
            label="Driver Phone"
            required
            value={vehPhone}
            onChange={(e) => setVehPhone(e.target.value)}
            placeholder="+1 (555) 904-5678"
          />
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="outline" onClick={() => setAddVehOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Register Bus
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Route Modal */}
      <Modal
        isOpen={addRouteOpen}
        onClose={() => setAddRouteOpen(false)}
        title="Create Bus Route"
        subtitle="Define route transit stops and term fees"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateRoute} className="space-y-4">
          <Input
            label="Route Name"
            required
            value={routeName}
            onChange={(e) => setRouteName(e.target.value)}
            placeholder="e.g. South Bay Express (Route 4)"
          />
          <Input
            label="Starting Location / Terminal"
            required
            value={routeStart}
            onChange={(e) => setRouteStart(e.target.value)}
            placeholder="e.g. Millbrae Transit Plaza"
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Morning Pickup Time"
              value={routePickup}
              onChange={(e) => setRoutePickup(e.target.value)}
            />
            <Input
              label="Afternoon Drop Time"
              value={routeDrop}
              onChange={(e) => setRouteDrop(e.target.value)}
            />
          </div>
          <Input
            label="Term Fee ($)"
            type="number"
            value={routeFee}
            onChange={(e) => setRouteFee(e.target.value)}
          />
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="outline" onClick={() => setAddRouteOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Route
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

