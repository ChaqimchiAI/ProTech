import { useState, useEffect, useRef, useCallback } from 'react';
import { DateRangePicker } from 'react-date-range';
import { addDays, endOfDay, startOfDay, isSameDay } from 'date-fns';
import { uz } from 'date-fns/locale';
import { Icon } from '@iconify/react';
import { useTheme } from '../../Context/Context';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import './CalendarSelected.css';

const staticRangesLabels = [
  {
    label: 'Bugun',
    range: () => ({ startDate: startOfDay(new Date()), endDate: endOfDay(new Date()) }),
  },
  {
    label: 'Kecha',
    range: () => ({
      startDate: startOfDay(addDays(new Date(), -1)),
      endDate: endOfDay(addDays(new Date(), -1)),
    }),
  },
  {
    label: 'Bu hafta',
    range: () => ({
      startDate: startOfDay(addDays(new Date(), -7)),
      endDate: endOfDay(new Date()),
    }),
  },
  {
    label: 'Bu oy',
    range: () => ({
      startDate: startOfDay(addDays(new Date(), -30)),
      endDate: endOfDay(new Date()),
    }),
  },
];

const CalendarSelector = ({ onRangeSelect, filters, placeholder, style, className }) => {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({});
  const dropdownRef = useRef(null);

  // filters.start_date bo'sh bo'lsa tanlovni bekor qilish
  useEffect(() => {
    if (!filters?.start_date) {
      setIsDateSelected(false);
    }
  }, [filters?.start_date]);

  const [isDateSelected, setIsDateSelected] = useState(!!filters?.start_date);

  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);

  const ref = useRef(null);

  // Dropdown pozitsiyasini hisoblash
  const calcPosition = useCallback(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dropdownW = 500; // taxminiy dropdown kengligi
    const dropdownH = 400; // taxminiy dropdown balandligi
    const gap = 8;

    const pos = {};

    // Vertikal: pastga sig'adimi?
    if (rect.bottom + dropdownH + gap > window.innerHeight && rect.top - dropdownH - gap > 0) {
      // Tepaga ochilsin
      pos.bottom = '110%';
      pos.top = 'auto';
    } else {
      // Pastga ochilsin (default)
      pos.top = '110%';
      pos.bottom = 'auto';
    }

    // Gorizontal: o'ngga sig'adimi?
    if (rect.left + dropdownW > window.innerWidth) {
      // O'ngdan joylash
      pos.right = '0';
      pos.left = 'auto';
    } else {
      // Chapdan joylash (default)
      pos.left = '0';
      pos.right = 'auto';
    }

    setDropdownPos(pos);
  }, []);

  useEffect(() => {
    if (open) calcPosition();
  }, [open, calcPosition]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', handleClickOutside, true);
    return () => document.removeEventListener('click', handleClickOutside, true);
  }, []);

  const handleSelect = (item) => {
    const { selection } = item;
    setState([selection]);
    setIsDateSelected(true); // Tanlov bajarildi

    if (onRangeSelect) {
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      onRangeSelect({
        start: formatDate(selection.startDate),
        end: formatDate(selection.endDate)
      });
    }
  };

  return (
    <div className={`calendar ${!theme ? 'dark-theme' : 'light-theme'} ${className || ''}`} ref={ref} style={style}>
      <div className="input-box border cursor-pointer" onClick={() => setOpen(!open)} style={style}>
        <span className="icon">
          <Icon icon="famicons:calendar-outline" width="20" height="20" />
        </span>
        <input
          readOnly
          // Agar tanlanmagan bo'lsa bo'sh qiymat, placeholder chiqishi uchun
          value={isDateSelected
            ? `${state[0].startDate.toLocaleDateString()} - ${state[0].endDate.toLocaleDateString()}`
            : ""}
          className="date-input"
          placeholder={placeholder || "Sana tanlang"}
          style={{ cursor: 'pointer' }}
        />
      </div>

      {open && (
        <div className="calendar-dropdown" ref={dropdownRef} style={dropdownPos}>
          <DateRangePicker
            onChange={handleSelect}
            showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            months={1}
            ranges={state}
            direction="vertical"
            locale={uz}
            staticRanges={staticRangesLabels.map(range => ({
              ...range,
              isSelected: () => isDateSelected &&
                isSameDay(range.range().startDate, state[0].startDate) &&
                isSameDay(range.range().endDate, state[0].endDate)
            }))}
            inputRanges={[]}
          />
        </div>
      )}
    </div>
  );
};

export default CalendarSelector;