import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface DateRangePickerProps {
  initialRange: { start: Date; end: Date };
  onConfirm: (range: { start: Date; end: Date }) => void;
  onCancel: () => void;
}

export function DateRangePicker({ initialRange, onConfirm, onCancel }: DateRangePickerProps) {
  const [startDate, setStartDate] = useState(initialRange.start);
  const [endDate, setEndDate] = useState(initialRange.end);
  const [currentMonth, setCurrentMonth] = useState(new Date(startDate));
  const [selectingStart, setSelectingStart] = useState(true);

  // Helper functions for date manipulation
  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Get first day of week (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = firstDay.getDay() || 7; // Convert Sunday from 0 to 7
    
    // Calculate days from previous month to show
    const prevMonthDays = firstDayOfWeek - 1;
    
    // Generate array of days
    const days = [];
    
    // Add previous month days
    const prevMonth = new Date(year, month, 0);
    const prevMonthLastDay = prevMonth.getDate();
    
    for (let i = prevMonthDays; i > 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i + 1),
        currentMonth: false,
      });
    }
    
    // Add current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({
        date: new Date(year, month, i),
        currentMonth: true,
      });
    }
    
    // Add next month days to complete the grid (6 rows of 7 days)
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        currentMonth: false,
      });
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const handleDayPress = (day: Date) => {
    if (selectingStart) {
      setStartDate(day);
      setEndDate(day); // Reset end date when changing start date
      setSelectingStart(false);
    } else {
      // Ensure end date is not before start date
      if (day < startDate) {
        setEndDate(startDate);
        setStartDate(day);
      } else {
        setEndDate(day);
      }
      setSelectingStart(true);
    }
  };

  const isDateInRange = (date: Date) => {
    return date >= startDate && date <= endDate;
  };

  const isStartDate = (date: Date) => {
    return date.toDateString() === startDate.toDateString();
  };

  const isEndDate = (date: Date) => {
    return date.toDateString() === endDate.toDateString();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Sélectionner une période</Text>
            <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
              <X size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.rangeInfo}>
            <View style={styles.dateContainer}>
              <Text style={styles.dateLabel}>Début</Text>
              <Text 
                style={[
                  styles.dateValue, 
                  selectingStart && styles.activeDate
                ]}
                onPress={() => setSelectingStart(true)}
              >
                {formatDate(startDate)}
              </Text>
            </View>
            
            <View style={styles.separator} />
            
            <View style={styles.dateContainer}>
              <Text style={styles.dateLabel}>Fin</Text>
              <Text 
                style={[
                  styles.dateValue, 
                  !selectingStart && styles.activeDate
                ]}
                onPress={() => setSelectingStart(false)}
              >
                {formatDate(endDate)}
              </Text>
            </View>
          </View>

          <View style={styles.calendar}>
            <View style={styles.monthNav}>
              <TouchableOpacity onPress={() => navigateMonth('prev')}>
                <ChevronLeft size={24} color={colors.textSecondary} />
              </TouchableOpacity>
              
              <Text style={styles.monthName}>
                {getMonthName(currentMonth)}
              </Text>
              
              <TouchableOpacity onPress={() => navigateMonth('next')}>
                <ChevronRight size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.weekdays}>
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => (
                <Text key={index} style={styles.weekday}>
                  {day}
                </Text>
              ))}
            </View>

            <View style={styles.days}>
              {days.map((item, index) => {
                const isInRange = isDateInRange(item.date);
                const isStart = isStartDate(item.date);
                const isEnd = isEndDate(item.date);
                
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.day,
                      !item.currentMonth && styles.dayOtherMonth,
                      isInRange && styles.dayInRange,
                      (isStart || isEnd) && styles.daySelected,
                    ]}
                    onPress={() => handleDayPress(item.date)}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        !item.currentMonth && styles.dayTextOtherMonth,
                        isInRange && styles.dayTextInRange,
                        (isStart || isEnd) && styles.dayTextSelected,
                      ]}
                    >
                      {item.date.getDate()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => onConfirm({ start: startDate, end: endDate })}
            >
              <Text style={styles.confirmButtonText}>Confirmer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  rangeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
  },
  dateContainer: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  activeDate: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  separator: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  calendar: {
    marginBottom: 20,
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  monthName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  weekdays: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekday: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '500',
    color: colors.textSecondary,
  },
  days: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  day: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayOtherMonth: {
    opacity: 0.3,
  },
  dayInRange: {
    backgroundColor: colors.backgroundLight,
  },
  daySelected: {
    backgroundColor: colors.primary,
    borderRadius: 20,
  },
  dayText: {
    fontSize: 14,
    color: colors.text,
  },
  dayTextOtherMonth: {
    color: colors.textLight,
  },
  dayTextInRange: {
    color: colors.primary,
  },
  dayTextSelected: {
    color: colors.white,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginRight: 8,
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 8,
    marginLeft: 8,
  },
  confirmButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
});