import React, { useState, useEffect } from 'react';
import { workingHoursApi } from '../../api/api';

const WEEKDAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'];
const WEEKEND = ['Cumartesi', 'Pazar'];

function sortDays(selectedDays, allDays) {
  return allDays.filter(day => selectedDays.includes(day));
}

const EditWorkingHours = () => {
  const [weekdays, setWeekdays] = useState([]);
  const [weekdayStart, setWeekdayStart] = useState('09:00');
  const [weekdayEnd, setWeekdayEnd] = useState('18:00');
  const [weekend, setWeekend] = useState([]);
  const [weekendStart, setWeekendStart] = useState('10:00');
  const [weekendEnd, setWeekendEnd] = useState('16:00');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError('');
    workingHoursApi.get()
      .then(data => {
        if (!data || (!data.weekdays && !data.weekend)) {
          setNoData(true);
        } else {
          setWeekdays(data.weekdays ? data.weekdays.split(',') : []);
          setWeekdayStart(data.weekdayStart || '09:00');
          setWeekdayEnd(data.weekdayEnd || '18:00');
          setWeekend(data.weekend ? data.weekend.split(',') : []);
          setWeekendStart(data.weekendStart || '10:00');
          setWeekendEnd(data.weekendEnd || '16:00');
          setNoData(false);
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Çalışma saatleri yüklenemedi.');
        setLoading(false);
        setNoData(true);
      });
  }, []);

  const handleCheckbox = (day, group) => {
    if (group === 'weekdays') {
      setWeekdays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
    } else {
      setWeekend(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    workingHoursApi.update({
      weekdays: sortDays(weekdays, WEEKDAYS).join(','),
      weekdayStart,
      weekdayEnd,
      weekend: sortDays(weekend, WEEKEND).join(','),
      weekendStart,
      weekendEnd
    })
      .then(data => {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      })
      .catch(() => {
        setError('Çalışma saatleri güncellenemedi.');
      });
  };

  if (loading) return <div className="p-6 text-gray-300">Yükleniyor...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Çalışma Saatleri</h2>
      {(error || noData) && (
        <div className="text-red-400 text-center mb-2">Çalışma saatleri eklenmedi.</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 rounded-lg p-6 shadow-lg">
        <div>
          <label className="block text-gray-300 mb-2 font-semibold">Hafta İçi Günleri</label>
          <div className="grid grid-cols-5 gap-2 mb-2">
            {WEEKDAYS.map(day => (
              <label
                key={day}
                className={`flex flex-col items-center justify-center cursor-pointer select-none px-2 py-1 rounded transition w-24 h-16 text-center text-sm
                  ${weekdays.includes(day) ? 'bg-blue-600/10 text-blue-500 font-semibold' : 'hover:bg-gray-700/30'}
                `}
                style={{ minWidth: 0 }}
              >
                <input
                  type="checkbox"
                  checked={weekdays.includes(day)}
                  onChange={() => handleCheckbox(day, 'weekdays')}
                  className="w-5 h-5 accent-blue-500 rounded-full border-2 border-blue-400 focus:ring-2 focus:ring-blue-400 transition mx-auto"
                />
                <span className="mt-1">{day}</span>
              </label>
            ))}
          </div>
          <div className="flex gap-4 items-center">
            <label className="text-gray-300">Başlangıç:</label>
            <input type="time" value={weekdayStart} onChange={e => setWeekdayStart(e.target.value)} className="rounded px-2 py-1 bg-gray-900 text-gray-100 border border-gray-700" />
            <label className="text-gray-300">Bitiş:</label>
            <input type="time" value={weekdayEnd} onChange={e => setWeekdayEnd(e.target.value)} className="rounded px-2 py-1 bg-gray-900 text-gray-100 border border-gray-700" />
          </div>
        </div>
        <div>
          <label className="block text-gray-300 mb-2 font-semibold">Hafta Sonu Günleri</label>
          <div className="grid grid-cols-2 gap-2 mb-2">
            {WEEKEND.map(day => (
              <label
                key={day}
                className={`flex items-center gap-2 cursor-pointer select-none px-2 py-1 rounded transition justify-center
                  ${weekend.includes(day) ? 'bg-blue-600/10 text-blue-500 font-semibold' : 'hover:bg-gray-700/30'}
                `}
                style={{ minWidth: 0 }}
              >
                <input
                  type="checkbox"
                  checked={weekend.includes(day)}
                  onChange={() => handleCheckbox(day, 'weekend')}
                  className="w-5 h-5 accent-blue-500 rounded-full border-2 border-blue-400 focus:ring-2 focus:ring-blue-400 transition"
                />
                <span>{day}</span>
              </label>
            ))}
          </div>
          <div className="flex gap-4 items-center">
            <label className="text-gray-300">Başlangıç:</label>
            <input type="time" value={weekendStart} onChange={e => setWeekendStart(e.target.value)} className="rounded px-2 py-1 bg-gray-900 text-gray-100 border border-gray-700" />
            <label className="text-gray-300">Bitiş:</label>
            <input type="time" value={weekendEnd} onChange={e => setWeekendEnd(e.target.value)} className="rounded px-2 py-1 bg-gray-900 text-gray-100 border border-gray-700" />
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
        >
          Kaydet
        </button>
        {success && (
          <div className="text-green-400 text-center font-medium mt-2">Çalışma saatleri başarıyla güncellendi!</div>
        )}
      </form>
    </div>
  );
};

export default EditWorkingHours; 