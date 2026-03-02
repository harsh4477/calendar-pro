# 📅 calendar-pro

A lightweight, fully responsive, and highly customizable React calendar dropdown component built for modern web applications. Perfect for booking systems, scheduling interfaces, forms, dashboards, and date-based workflows.

---

## 🚀 Installation

```bash
npm install calendar-pro
# or
yarn add calendar-pro
```

---

## 🧩 Basic Usage

To get started, import the `Calendar` component and its styles:

```jsx
import React from 'react';
import Calendar from 'calendar-pro';
import 'calendar-pro/style.css';

function App() {
  const handleDateSelect = (dateObject, formattedDateString) => {
    console.log("Selected Date:", dateObject, formattedDateString);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Calendar onDateSelect={handleDateSelect} />
    </div>
  );
}

export default App;
```

---

## ✨ Features

* 📆 Modern dropdown calendar UI
* 🎯 Min & max date restrictions
* 🎨 Fully customizable theme (CSS variables)
* 🧩 Custom SVG icon support
* 📱 Fully responsive design
* ⚡ Lightweight and optimized
* 🔁 Works with React 16, 17, and 18

---

## 🔒 Date Limits (`minDate` & `maxDate`)

Restrict date selection within a defined range.

```jsx
const minD = new Date();
minD.setDate(minD.getDate() - 5);

const maxD = new Date();
maxD.setDate(maxD.getDate() + 15);

<Calendar 
  minDate={minD} 
  maxDate={maxD} 
  onDateSelect={(date) => console.log(date)} 
/>
```

When restricted:

* Dates outside range are disabled
* Month/year navigation respects limits
* Arrows disable automatically at boundaries

---

## 🎨 Theming Support

Easily customize the look using a `theme` object:

```jsx
<Calendar 
  theme={{
    bg: '#fdf2f2',
    text: '#c62828',
    'dropdown-bg': '#ffebee',
    'dropdown-text': '#b71c1c',
    'dropdown-hover-bg': '#ffcdd2',
    'active-bg': '#d32f2f',
    'active-text': '#ffffff',
    'hover-bg': '#ef9a9a',
    'inactive-text': '#ef9a9a'
  }}
/>
```

---

## 🎛 Custom Styling

```jsx
<Calendar 
  className="my-calendar-wrapper"
  style={{ border: '2px solid red', borderRadius: '10px' }} 
/>
```

---

## 🖼 Custom SVG Icons

```jsx
<Calendar 
  calendarIcon={<MyCustomCalendarSvg />}
  prevIcon={<MyCustomLeftArrow />}
  nextIcon={<MyCustomRightArrow />}
/>
```

---

## 📘 Props Reference

| Prop           | Type                       | Default      | Description                            |
| -------------- | -------------------------- | ------------ | -------------------------------------- |
| `onDateSelect` | `(Date, string) => void`   | `undefined`  | Triggered when a date is selected.     |
| `initialDate`  | `Date \| string \| number` | `new Date()` | Initial loaded date.                   |
| `minDate`      | `Date \| string \| number` | `null`       | Minimum selectable date.               |
| `maxDate`      | `Date \| string \| number` | `null`       | Maximum selectable date.               |
| `theme`        | `Object`                   | `{}`         | Theme customization via CSS variables. |
| `className`    | `string`                   | `""`         | Extra class for root container.        |
| `style`        | `Object`                   | `{}`         | Inline styles for root container.      |
| `calendarIcon` | `ReactNode`                | `undefined`  | Custom calendar icon.                  |
| `prevIcon`     | `ReactNode`                | `undefined`  | Custom previous month icon.            |
| `nextIcon`     | `ReactNode`                | `undefined`  | Custom next month icon.                |

---

## 🏷 Keywords 

React Calendar • React Date Picker • React Scheduler • Event Calendar • Booking Calendar • Custom React Calendar • React UI Component • Calendar Dropdown • Appointment Scheduler • Modern React Calendar

---

