import { FC, useState } from 'react';
import { View, StyleSheet, Text, Platform, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import colors from '@utils/colors';
import { formatDate } from '@utils/date';
import React from 'react';

interface Props {
  title: string;
  value: Date;
  onChange(value: Date): void;
}

const isIos = Platform.OS === 'ios';

const DatePicker: FC<Props> = ({ title, value, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);
  const visible = isIos ? true : showPicker;

  const handleOnPress = () => {
    if (isIos) return;
    setShowPicker(true);
  };

  const handleChange = (_: any, selectedDate?: Date) => {
    if (selectedDate) {
      onChange(selectedDate);
    }
    if (!isIos) {
      setShowPicker(false);
    }
  };

  return (
    <Pressable onPress={handleOnPress} style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {!isIos && (
        <Text style={styles.value}>
          {formatDate(value.toISOString(), 'dd LLL, yyyy')}
        </Text>
      )}

      {visible && (
        <DateTimePicker
          testID="datePicker"
          value={value}
          mode="date"
          display="default"
          onChange={handleChange}
        />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
    padding: isIos ? 0 : 8,
    borderColor: colors.inActive,
    borderRadius: 5,
  },
  title: {
    color: colors.black,
  },
  value: {
    color: colors.black,
    paddingLeft: 10,
  },
});

export default DatePicker;



// import { FC, useState } from 'react';
// import { View, StyleSheet, Text, Platform, Pressable } from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import colors from '@utils/colors';
// import { formatDate } from '@utils/date';
// import React from 'react';

// interface Props {
//   title: string;
//   value: Date;
//   onChange(value: Date): void;
// }

// const isIos = Platform.OS === 'ios';

// const DatePicker: FC<Props> = ({ title, value, onChange }) => {
//   const [showPicker, setShowPicker] = useState(false);
//   const visible = isIos ? true : showPicker;

//   const handleOnPress = () => {
//     if (isIos) return;
//     setShowPicker(true);
//   };

//   const handleChange = (_: any, selectedDate?: Date) => {
//     if (selectedDate) {
//       onChange(selectedDate);
//     }
//     if (!isIos) {
//       setShowPicker(false);
//     }
//   };

//   return (
//     <Pressable onPress={handleOnPress} style={styles.container}>
//       <Text style={styles.title}>{title}</Text>
//       {!isIos && (
//         <Text style={styles.value}>
//           {formatDate(value.toISOString(), 'dd LLL, yyyy')}
//         </Text>
//       )}

//       {visible && (
//         <DateTimePicker
//           testID="datePicker"
//           value={value}
//           mode="date"
//           display="default"
//           onChange={handleChange}
//         />
//       )}
//     </Pressable>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     width: '100%',
//     marginBottom: 15,
//     padding: isIos ? 0 : 8,
//     borderColor: colors.inActive,
//     borderRadius: 5,
//   },
//   title: {
//     color: colors.black,
//   },
//   value: {
//     color: colors.black,
//     paddingLeft: 10,
//   },
// });

// export default DatePicker;
