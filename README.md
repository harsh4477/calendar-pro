# React Custom Calendar

A fully responsive, highly customizable calendar dropdown component for React.

## Installation

```bash
npm install react-custom-calendar
# or
yarn add react-custom-calendar
```

## Basic Usage

To get started, simply import the `Calendar` component and its styles.

```jsx
import React, { useState } from 'react';
import Calendar from 'react-custom-calendar';
import 'react-custom-calendar/style.css'; // Don't forget to import the styles!

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

## Advanced Features & Customization

The core strength of `react-custom-calendar` is its extensive customizability and restrictions.

### Date Limits (`minDate` & `maxDate`)
You can restrict the user from selecting dates outside of a specific range using `minDate` and `maxDate`. This is useful for things like booking systems where past dates or dates too far in the future should be disabled.
When dates are restricted:
- Days outside the range will be disabled and unclickable.
- The user won't be able to navigate to months or years outside the valid boundaries.
- The previous/next month arrows will become disabled when the limit is reached.

```jsx
const minD = new Date();
minD.setDate(minD.getDate() - 5);  // Limit selection to dates from 5 days ago

const maxD = new Date();
maxD.setDate(maxD.getDate() + 15); // Limit selection to max 15 days in the future

<Calendar 
  minDate={minD} 
  maxDate={maxD} 
  onDateSelect={(date) => console.log(date)} 
/>
```

### Theming
The calendar component relies on CSS variables for its internal colors, making it incredibly easy to completely re-theme the component without writing custom CSS classes. You can just pass a `theme` object!

```jsx
<Calendar 
  theme={{
    'bg': '#fdf2f2',                  // Main background color
    'text': '#c62828',                // Main text color
    'dropdown-bg': '#ffebee',         // Month/Year dropdown background
    'dropdown-text': '#b71c1c',       // Dropdown item text
    'dropdown-hover-bg': '#ffcdd2',   // Dropdown item hover background
    'active-bg': '#d32f2f',           // Active/selected day background
    'active-text': '#ffffff',         // Active/selected day text
    'hover-bg': '#ef9a9a',            // Hover state for date items
    'inactive-text': '#ef9a9a'        // Text for disabled or neighboring month days
  }}
/>
```

### Custom Styling & Classes
If you need layout-level adjustments, you can pass standard `style` and `className` props which will be applied to the topmost container.

```jsx
<Calendar 
  className="my-calendar-wrapper"
  style={{ border: '2px solid red', borderRadius: '10px' }} 
/>
```

### Custom SVG Icons
Don't like the default icons? Pass your own JSX/SVG elements.

```jsx
<Calendar 
    calendarIcon={<MyCustomCalendarSvg />}
    prevIcon={<MyCustomLeftArrow />}
    nextIcon={<MyCustomRightArrow />}
/>
```

---

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onDateSelect` | `(Date, string) => void` | `undefined` | Callback fired when a date is selected. Returns the `Date` object and a formatted string (`DD/MM/YYYY`). |
| `initialDate` | `Date \| string \| number` | `new Date()` | The initial date the calendar should load with. |
| `minDate` | `Date \| string \| number` | `null` | The earliest date the user is allowed to select. |
| `maxDate` | `Date \| string \| number` | `null` | The latest date the user is allowed to select. |
| `theme` | `Object` | `{}` | An object mapping to internal CSS variables for theming. |
| `className` | `string` | `""` | Standard HTML class attribute appended to the root element. |
| `style` | `Object` | `{}` | Inline styles applied to the root element. |
| `calendarIcon` | `ReactNode` | `undefined` | Replaces the default calendar icon next to the selected date text. |
| `prevIcon` | `ReactNode` | `undefined` | Replaces the left arrow icon for previous month navigation. |
| `nextIcon` | `ReactNode` | `undefined` | Replaces the right arrow icon for next month navigation. |
