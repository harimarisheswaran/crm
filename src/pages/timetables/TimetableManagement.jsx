import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input, Select } from '../../components/common/Input';
import {
  Calendar,
  Clock,
  Plus,
  Printer,
  Trash2,
  BookOpen,
  Coffee,
} from 'lucide-react';

export const TimetableManagement = () => {
  const { classes, sections, subjects, teachers, timetables, addTimetableSlot, deleteTimetableSlot } = useData();
  const { success, warning } = useToast();

  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || 'cls-10');
  const [selectedDay, setSelectedDay] = useState('All'); // 'All' | 'Monday' | 'Tuesday'...
  const [addModalOpen, setAddModalOpen] = useState(false);

  // New slot form
  const [slotDay, setSlotDay] = useState('Monday');
  const [slotPeriod, setSlotPeriod] = useState('1');
  const [slotStart, setSlotStart] = useState('08:30');
  const [slotEnd, setSlotEnd] = useState('09:20');
  const [slotSubject, setSlotSubject] = useState(subjects[0]?.name || 'Mathematics');
  const [slotTeacher, setSlotTeacher] = useState(teachers[0]?.name || 'Marcus Vance');
  const [slotRoom, setSlotRoom] = useState('Room 301');
  const [slotIsBreak, setSlotIsBreak] = useState(false);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const filteredSlots = timetables.filter((t) => {
    const matchesClass = t.class_id === selectedClassId;
    const matchesDay = selectedDay === 'All' || t.day_of_week === selectedDay;
    return matchesClass && matchesDay;
  });

  const handleCreateSlot = (e) => {
    e.preventDefault();
    addTimetableSlot({
      class_id: selectedClassId,
      section_id: 'sec-10A',
      subject_id: 'sbj-01',
      day_of_week: slotDay,
      period_number: Number(slotPeriod),
      start_time: slotStart,
      end_time: slotEnd,
      subject_name: slotIsBreak ? 'Recess / Break' : slotSubject,
      teacher_name: slotIsBreak ? '' : slotTeacher,
      room_number: slotRoom,
      is_break: slotIsBreak,
    });

    success(`Period slot added for ${slotDay}!`);
    setAddModalOpen(false);
  };

  const handleDeleteSlot = (id) => {
    deleteTimetableSlot(id);
    warning('Period slot removed from schedule.');
  };

  const handlePrint = () => {
    window.print();
  };

  const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Class Timetables & Weekly Schedules
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Period allocations, break schedules, subject assignments and classroom rooms.
          </p>
        </div>

        <div className="flex items-center gap-2.5 no-print">
          <Button
            variant="outline"
            size="sm"
            icon={Printer}
            onClick={handlePrint}
          >
            Print Timetable
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setAddModalOpen(true)}
          >
            Add Period Slot
          </Button>
        </div>
      </div>

      {/* Class & Day Selector Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm no-print">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Select Class:</span>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-brand-500"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setSelectedDay('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedDay === 'All'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Full Week
          </button>
          {daysOfWeek.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => setSelectedDay(day)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedDay === day
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Weekly Schedule View */}
      <Card
        title={`Academic Timetable — ${currentClass?.name}`}
        subtitle="Weekly rotational schedule for Secondary School"
      >
        <div className="space-y-6">
          {daysOfWeek
            .filter((d) => selectedDay === 'All' || selectedDay === d)
            .map((day) => {
              const daySlots = timetables.filter(
                (t) => t.class_id === selectedClassId && t.day_of_week === day
              );

              return (
                <div key={day} className="space-y-2.5">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-brand-600" />
                      {day}
                    </h3>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {daySlots.length} Periods Scheduled
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {daySlots.length > 0 ? (
                      daySlots.map((slot) => (
                        <div
                          key={slot.id}
                          className={`p-3.5 rounded-xl border transition-all ${
                            slot.is_break
                              ? 'bg-amber-50/50 border-amber-200'
                              : 'bg-white border-slate-200 shadow-sm hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[11px] font-bold text-slate-500 font-mono">
                              Period #{slot.period_number}
                            </span>
                            {slot.is_break ? (
                              <Badge variant="warning" size="sm">
                                <Coffee className="w-3 h-3 mr-1" /> Break
                              </Badge>
                            ) : (
                              <span className="text-[11px] font-semibold text-slate-600">
                                {slot.room_number}
                              </span>
                            )}
                          </div>

                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {slot.subject_name}
                          </h4>

                          {!slot.is_break && slot.teacher_name && (
                            <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                              Faculty: {slot.teacher_name}
                            </p>
                          )}

                          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                            <span className="font-mono text-slate-600 font-medium">
                              {slot.start_time} - {slot.end_time}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDeleteSlot(slot.id)}
                              className="text-slate-400 hover:text-rose-600 transition-colors no-print"
                              title="Delete Period"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full py-4 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        No periods scheduled for {day}. Click "Add Period Slot" to assign.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </Card>

      {/* Add Period Slot Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Timetable Period Slot"
        subtitle={`Assign period to ${currentClass?.name}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateSlot} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Day of Week"
              value={slotDay}
              onChange={(e) => setSlotDay(e.target.value)}
              options={daysOfWeek.map((d) => ({ value: d, label: d }))}
            />
            <Input
              label="Period Number"
              type="number"
              min={1}
              max={10}
              value={slotPeriod}
              onChange={(e) => setSlotPeriod(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Time"
              type="time"
              value={slotStart}
              onChange={(e) => setSlotStart(e.target.value)}
            />
            <Input
              label="End Time"
              type="time"
              value={slotEnd}
              onChange={(e) => setSlotEnd(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 py-1">
            <input
              type="checkbox"
              id="isBreak"
              checked={slotIsBreak}
              onChange={(e) => setSlotIsBreak(e.target.checked)}
              className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
            />
            <label htmlFor="isBreak" className="text-xs font-semibold text-slate-700">
              This slot is a Recess / Lunch Break
            </label>
          </div>

          {!slotIsBreak && (
            <>
              <Select
                label="Subject"
                value={slotSubject}
                onChange={(e) => setSlotSubject(e.target.value)}
                options={subjects.map((s) => ({ value: s.name, label: s.name }))}
              />
              <Select
                label="Teaching Faculty"
                value={slotTeacher}
                onChange={(e) => setSlotTeacher(e.target.value)}
                options={teachers.map((t) => ({ value: t.name, label: t.name }))}
              />
              <Input
                label="Classroom / Lab Venue"
                value={slotRoom}
                onChange={(e) => setSlotRoom(e.target.value)}
                placeholder="e.g. Room 301, Tech Lab 1"
              />
            </>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="outline" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Period Slot
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

