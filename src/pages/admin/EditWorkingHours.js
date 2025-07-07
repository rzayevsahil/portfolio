import React, { useState, useEffect } from 'react';
import { workingHoursApi } from '../../api/api';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import GlobalLoader from '../../components/GlobalLoader';
import i18n from 'i18next';
import { getTranslatedErrorMessage } from '../../utils/errorHelpers';

const WEEKDAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
const WEEKEND = ['saturday', 'sunday'];

const trToEn = {
  'Pazartesi': 'monday',
  'Salı': 'tuesday',
  'Çarşamba': 'wednesday',
  'Perşembe': 'thursday',
  'Cuma': 'friday',
  'Cumartesi': 'saturday',
  'Pazar': 'sunday'
};
const enToTr = {
  'monday': 'Pazartesi',
  'tuesday': 'Salı',
  'wednesday': 'Çarşamba',
  'thursday': 'Perşembe',
  'friday': 'Cuma',
  'saturday': 'Cumartesi',
  'sunday': 'Pazar'
};

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
  const [existingData, setExistingData] = useState(null);
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    setLoading(true);
    setError('');
    workingHoursApi.get()
      .then(data => {
        if (!data || (!data.weekdays && !data.weekend)) {
          setNoData(true);
          setExistingData(null);
        } else {
          setWeekdays(data.weekdays ? data.weekdays.split(',').map(day => trToEn[day] || day) : []);
          setWeekdayStart(data.weekdayStart || '09:00');
          setWeekdayEnd(data.weekdayEnd || '18:00');
          setWeekend(data.weekend ? data.weekend.split(',').map(day => trToEn[day] || day) : []);
          setWeekendStart(data.weekendStart || '10:00');
          setWeekendEnd(data.weekendEnd || '16:00');
          setExistingData(data);
          setNoData(false);
        }
        setLoading(false);
      })
      .catch((error) => {
        setError(getTranslatedErrorMessage(error.message, t, i18n, 'workingHours.noData'));
        setLoading(false);
        setNoData(true);
        setExistingData(null);
      });
  }, [t]);

  useEffect(() => {
    if (error) {
      setError(getTranslatedErrorMessage(error, t, i18n, 'workingHours.noData'));
      const timer = setTimeout(() => setError(''), 2000);
      return () => clearTimeout(timer);
    }
  }, [error, t, i18n.language]);

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
    
    const workingHoursData = {
      weekdays: sortDays(weekdays, WEEKDAYS).map(day => enToTr[day] || day).join(','),
      weekdayStart,
      weekdayEnd,
      weekend: sortDays(weekend, WEEKEND).map(day => enToTr[day] || day).join(','),
      weekendStart,
      weekendEnd
    };

    if (existingData && existingData.id) {
      // Güncelleme - mevcut veri varsa ve ID'si varsa
      workingHoursApi.update(existingData.id, workingHoursData)
        .then(data => {
          setSuccess(true);
          setTimeout(() => setSuccess(false), 2000);
        })
        .catch(() => {
          setError(t('workingHours.updateError'));
        });      
    } else {
      // Ekleme - mevcut veri yoksa veya ID'si yoksa
      workingHoursApi.add(workingHoursData)
        .then(data => {
          setSuccess(true);
          setTimeout(() => setSuccess(false), 2000);
          // Başarılı ekleme sonrası veriyi yeniden yükle
          workingHoursApi.get()
            .then(data => {
              if (data) {
                setExistingData(data);
                setNoData(false);
              }
            })
            .catch(() => {});
        })
        .catch(() => {
          setError(t('workingHours.updateError'));
        });   
    }    
  };

  if (loading) return <GlobalLoader show={true} />;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">{t('workingHours.title')}</h2>
      {/* Alert Messages */}
      {error && (
        <div className="fixed top-8 left-1/2 z-50 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg font-semibold text-base transition-all duration-300 bg-red-500 text-white" style={{ minWidth: 220, textAlign: 'center' }}>
          {error}
        </div>
      )}
      {success && (
        <div className="fixed top-8 left-1/2 z-50 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg font-semibold text-base transition-all duration-300 bg-green-500 text-white" style={{ minWidth: 220, textAlign: 'center' }}>
          {t('workingHours.success')}
        </div>
      )}
      {(error || noData) && (
        <div className="text-red-400 text-center mb-2">{t('workingHours.noData')}</div>
      )}
      <form onSubmit={handleSubmit} className={`space-y-6 rounded-lg p-6 shadow-lg transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div>
          <label className={`block mb-2 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('workingHours.weekdays')}</label>
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
                <span className="mt-1">{t(`workingHours.days.${day}`)}</span>
              </label>
            ))}
          </div>
          <div className="flex gap-4 items-center">
            <label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{t('workingHours.start')}</label>
            <input type="time" value={weekdayStart} onChange={e => setWeekdayStart(e.target.value)} className={`rounded px-2 py-1 ${isDarkMode ? 'bg-gray-900 text-gray-100 border-gray-700' : 'bg-gray-200 text-gray-900 border-gray-300'}`} />
            <label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{t('workingHours.end')}</label>
            <input type="time" value={weekdayEnd} onChange={e => setWeekdayEnd(e.target.value)} className={`rounded px-2 py-1 ${isDarkMode ? 'bg-gray-900 text-gray-100 border-gray-700' : 'bg-gray-200 text-gray-900 border-gray-300'}`} />
          </div>
        </div>
        <div>
          <label className={`block mb-2 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('workingHours.weekend')}</label>
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
                <span>{t(`workingHours.days.${day}`)}</span>
              </label>
            ))}
          </div>
          <div className="flex gap-4 items-center">
            <label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{t('workingHours.start')}</label>
            <input type="time" value={weekendStart} onChange={e => setWeekendStart(e.target.value)} className={`rounded px-2 py-1 ${isDarkMode ? 'bg-gray-900 text-gray-100 border-gray-700' : 'bg-gray-200 text-gray-900 border-gray-300'}`} />
            <label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{t('workingHours.end')}</label>
            <input type="time" value={weekendEnd} onChange={e => setWeekendEnd(e.target.value)} className={`rounded px-2 py-1 ${isDarkMode ? 'bg-gray-900 text-gray-100 border-gray-700' : 'bg-gray-200 text-gray-900 border-gray-300'}`} />
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
        >
          {t('workingHours.save')}
        </button>
      </form>
    </div>
  );
};

export default EditWorkingHours; 