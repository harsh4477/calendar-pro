import React, { useState, useEffect, useRef, useMemo } from "react";
import "./Calendar.scss";

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const Calendar = ({
    onDateSelect,
    initialDate,
    minDate,
    maxDate,
    className = "",
    style = {},
    calendarIcon,
    prevIcon,
    nextIcon,
    theme = {}
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const initial = initialDate ? new Date(initialDate) : new Date();
    const [currentYear, setCurrentYear] = useState(initial.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(initial.getMonth());
    const [selectedDateObj, setSelectedDateObj] = useState(
        initialDate ? initial : null
    );

    // Apply CSS variables from theme prop
    useEffect(() => {
        if (wrapperRef.current && theme) {
            Object.entries(theme).forEach(([key, value]) => {
                wrapperRef.current.style.setProperty(`--rcc-${key}`, value);
            });
        }
    }, [theme]);

    const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
    const [yearDropdownOpen, setYearDropdownOpen] = useState(false);

    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
                setMonthDropdownOpen(false);
                setYearDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const lastDateOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const lastDayOfMonth = new Date(
        currentYear,
        currentMonth,
        lastDateOfMonth
    ).getDay();
    const lastDateOfLastMonth = new Date(currentYear, currentMonth, 0).getDate();

    // Memoize the boundary dates to strip out time parts for easier comparison
    const minDateObj = useMemo(() => minDate ? new Date(new Date(minDate).setHours(0, 0, 0, 0)) : null, [minDate]);
    const maxDateObj = useMemo(() => maxDate ? new Date(new Date(maxDate).setHours(0, 0, 0, 0)) : null, [maxDate]);

    // Check if a specific date (year, month, day) is outside the allowed bounds
    const isDateDisabled = (year, month, day) => {
        const dateToCheck = new Date(year, month, day);
        if (minDateObj && dateToCheck < minDateObj) return true;
        if (maxDateObj && dateToCheck > maxDateObj) return true;
        return false;
    };

    // Check if an entire month is outside the allowed bounds
    const isMonthDisabled = (year, month) => {
        const lastDayOfThisMonth = new Date(year, month + 1, 0).getDate();
        const startOfMonth = new Date(year, month, 1);
        const endOfMonth = new Date(year, month, lastDayOfThisMonth);

        if (maxDateObj && startOfMonth > maxDateObj) return true;
        if (minDateObj && endOfMonth < minDateObj) return true;
        return false;
    };

    // Check if an entire year is outside the allowed bounds
    const isYearDisabled = (year) => {
        const startOfYear = new Date(year, 0, 1);
        const endOfYear = new Date(year, 11, 31);
        if (maxDateObj && startOfYear > maxDateObj) return true;
        if (minDateObj && endOfYear < minDateObj) return true;
        return false;
    };

    const handlePrevNext = (direction, e) => {
        e.stopPropagation();
        let newMonth = direction === "prev" ? currentMonth - 1 : currentMonth + 1;
        let newYear = currentYear;

        if (newMonth < 0) {
            newMonth = 11;
            newYear -= 1;
        } else if (newMonth > 11) {
            newMonth = 0;
            newYear += 1;
        }

        // Prevent navigating to disabled months
        if (isMonthDisabled(newYear, newMonth)) return;

        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
    };

    const handleDateClick = (day) => {
        if (isDateDisabled(currentYear, currentMonth, day)) return;

        const newSelectedDateObj = new Date(currentYear, currentMonth, day);
        setSelectedDateObj(newSelectedDateObj);

        const formattedDate = `${day}/${currentMonth + 1}/${currentYear}`;

        if (onDateSelect) {
            onDateSelect(newSelectedDateObj, formattedDate);
        }

        setIsOpen(false);
        setMonthDropdownOpen(false);
        setYearDropdownOpen(false);
    };

    const toggleCalendar = () => {
        setIsOpen(!isOpen);
        if (isOpen) {
            setMonthDropdownOpen(false);
            setYearDropdownOpen(false);
        }
    };

    const toggleMonthDropdown = (e) => {
        e.stopPropagation();
        setMonthDropdownOpen(!monthDropdownOpen);
        setYearDropdownOpen(false);
    };

    const toggleYearDropdown = (e) => {
        e.stopPropagation();
        setYearDropdownOpen(!yearDropdownOpen);
        setMonthDropdownOpen(false);
    };

    const selectMonth = (index, e) => {
        e.stopPropagation();
        if (isMonthDisabled(currentYear, index)) return;
        setCurrentMonth(index);
        setMonthDropdownOpen(false);
    };

    const selectYear = (year, e) => {
        e.stopPropagation();
        if (isYearDisabled(year)) return;
        setCurrentYear(year);
        // Find a valid month in the new year
        if (isMonthDisabled(year, currentMonth)) {
            for (let m = 0; m < 12; m++) {
                if (!isMonthDisabled(year, m)) {
                    setCurrentMonth(m);
                    break;
                }
            }
        }
        setYearDropdownOpen(false);
    };

    const thisYear = new Date().getFullYear();
    const years = [];
    for (let i = thisYear - 50; i <= thisYear + 50; i++) {
        years.push(i);
    }

    const prevMonthDays = [];
    for (let i = firstDayOfMonth; i > 0; i--) {
        prevMonthDays.push(lastDateOfLastMonth - i + 1);
    }

    const currentMonthDays = [];
    for (let i = 1; i <= lastDateOfMonth; i++) {
        currentMonthDays.push(i);
    }

    const nextMonthDays = [];
    for (let i = lastDayOfMonth; i < 6; i++) {
        nextMonthDays.push(i - lastDayOfMonth + 1);
    }

    const displayDate = selectedDateObj
        ? `${selectedDateObj.getDate()}/${selectedDateObj.getMonth() + 1}/${selectedDateObj.getFullYear()}`
        : "Select a Date";

    return (
        <div className={`calendar-main ${className}`} style={style} ref={wrapperRef}>
            <div className="calendar-drop-main" onClick={toggleCalendar}>
                <span className="calendar-drop-text">{displayDate}</span>
                {calendarIcon ? (
                    calendarIcon
                ) : (
                    <svg
                        fill="#fff"
                        width="24px"
                        height="24px"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g strokeWidth="0"></g>
                        <g strokeLinecap="round" strokeLinejoin="round"></g>
                        <g>
                            <path d="m22 2.25h-3.25v-1.5c-.014-.404-.344-.726-.75-.726s-.736.322-.75.725v.001 1.5h-4.5v-1.5c-.014-.404-.344-.726-.75-.726s-.736.322-.75.725v.001 1.5h-4.5v-1.5c-.014-.404-.344-.726-.75-.726s-.736.322-.75.725v.001 1.5h-3.25c-1.104 0-2 .895-2 1.999v17.75c0 1.105.895 2 2 2h20c1.105 0 2-.895 2-2v-17.75c0-1.104-.896-1.999-2-1.999zm.5 19.75c0 .276-.224.499-.499.5h-20.001c-.276 0-.5-.224-.5-.5v-17.75c.001-.276.224-.499.5-.499h3.25v1.5c.014.404.344.726.75.726s.736-.322.75-.725v-.001-1.5h4.5v1.5c.014.404.344.726.75.726s.736-.322.75-.725v-.001-1.5h4.5v1.5c.014.404.344.726.75.726s.736-.322.75-.725v-.001-1.5h3.25c.276 0 .499.224.499.499z"></path>
                            <path d="m5.25 9h3v2.25h-3z"></path>
                            <path d="m5.25 12.75h3v2.25h-3z"></path>
                            <path d="m5.25 16.5h3v2.25h-3z"></path>
                            <path d="m10.5 16.5h3v2.25h-3z"></path>
                            <path d="m10.5 12.75h3v2.25h-3z"></path>
                            <path d="m10.5 9h3v2.25h-3z"></path>
                            <path d="m15.75 16.5h3v2.25h-3z"></path>
                            <path d="m15.75 12.75h3v2.25h-3z"></path>
                            <path d="m15.75 9h3v2.25h-3z"></path>
                        </g>
                    </svg>
                )}
            </div>
            <div className={`calendar-wrapper ${isOpen ? "show-calender" : ""}`}>
                <div className="calendar-header">
                    <div className="calendar-select-main">
                        <div className="calendar-select-wrapper">
                            <div className="calendar-select">
                                <div onClick={toggleMonthDropdown}>{months[currentMonth]}</div>
                                <div
                                    className={`calendar-select-list-wrap ${monthDropdownOpen ? "show-dropdown" : ""
                                        }`}
                                >
                                    {months.map((month, index) => {
                                        const disabled = isMonthDisabled(currentYear, index);
                                        return (
                                            <div
                                                key={index}
                                                className={`calendar-select-list month ${currentMonth === index ? "active" : ""} ${disabled ? "disabled" : ""}`}
                                                onClick={(e) => selectMonth(index, e)}
                                                style={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
                                            >
                                                {month}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="calendar-select-wrapper">
                            <div className="calendar-select">
                                <div onClick={toggleYearDropdown}>{currentYear}</div>
                                <div
                                    className={`calendar-select-list-wrap ${yearDropdownOpen ? "show-dropdown" : ""
                                        }`}
                                >
                                    {years.map((year) => {
                                        const disabled = isYearDisabled(year);
                                        return (
                                            <div
                                                key={year}
                                                className={`calendar-select-list year ${currentYear === year ? "active" : ""} ${disabled ? "disabled" : ""}`}
                                                onClick={(e) => selectYear(year, e)}
                                                style={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
                                            >
                                                {year}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="icons">
                        <span
                            onClick={(e) => handlePrevNext("prev", e)}
                            className={`leftIcon ${isMonthDisabled(currentYear, currentMonth - 1) ? "disabled" : ""}`}
                            style={{ opacity: isMonthDisabled(currentYear, currentMonth - 1) ? 0.5 : 1, cursor: isMonthDisabled(currentYear, currentMonth - 1) ? 'not-allowed' : 'pointer' }}
                        >
                            {prevIcon ? (
                                prevIcon
                            ) : (
                                <svg
                                    width="24px"
                                    height="24px"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <g strokeWidth="0"></g>
                                    <g strokeLinecap="round" strokeLinejoin="round"></g>
                                    <g>
                                        <path
                                            d="M14.9991 19L9.83911 14C9.56672 13.7429 9.34974 13.433 9.20142 13.0891C9.0531 12.7452 8.97656 12.3745 8.97656 12C8.97656 11.6255 9.0531 11.2548 9.20142 10.9109C9.34974 10.567 9.56672 10.2571 9.83911 10L14.9991 5"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            stroke="#fff"
                                        ></path>
                                    </g>
                                </svg>
                            )}
                        </span>
                        <span
                            onClick={(e) => handlePrevNext("next", e)}
                            className={`rightIcon ${isMonthDisabled(currentYear, currentMonth + 1) ? "disabled" : ""}`}
                            style={{ opacity: isMonthDisabled(currentYear, currentMonth + 1) ? 0.5 : 1, cursor: isMonthDisabled(currentYear, currentMonth + 1) ? 'not-allowed' : 'pointer' }}
                        >
                            {nextIcon ? (
                                nextIcon
                            ) : (
                                <svg
                                    width="24px"
                                    height="24px"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <g strokeWidth="0"></g>
                                    <g strokeLinecap="round" strokeLinejoin="round"></g>
                                    <g>
                                        <path
                                            d="M9 5L14.15 10C14.4237 10.2563 14.6419 10.5659 14.791 10.9099C14.9402 11.2539 15.0171 11.625 15.0171 12C15.0171 12.375 14.9402 12.7458 14.791 13.0898C14.6419 13.4339 14.4237 13.7437 14.15 14L9 19"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            stroke="#fff"
                                        ></path>
                                    </g>
                                </svg>
                            )}
                        </span>
                    </div>
                </div>
                <div className="calendar">
                    <ul className="weeks">
                        <li>Su</li>
                        <li>Mo</li>
                        <li>Tu</li>
                        <li>We</li>
                        <li>Th</li>
                        <li>Fr</li>
                        <li>Sa</li>
                    </ul>
                    <ul className="days">
                        {prevMonthDays.map((day, idx) => (
                            <li key={`prev-${idx}`} className="inactive">
                                {day}
                            </li>
                        ))}
                        {currentMonthDays.map((day) => {
                            let isSelected = false;
                            if (selectedDateObj) {
                                if (
                                    day === selectedDateObj.getDate() &&
                                    currentMonth === selectedDateObj.getMonth() &&
                                    currentYear === selectedDateObj.getFullYear()
                                ) {
                                    isSelected = true;
                                }
                            }

                            let isToday = false;
                            if (
                                !selectedDateObj &&
                                day === new Date().getDate() &&
                                currentMonth === new Date().getMonth() &&
                                currentYear === new Date().getFullYear()
                            ) {
                                isToday = true;
                            }

                            const disabled = isDateDisabled(currentYear, currentMonth, day);
                            let classNames = [];
                            if (isSelected) classNames.push("active");
                            else if (isToday) classNames.push("active");

                            if (disabled) classNames.push("disabled");

                            return (
                                <li
                                    key={`current-${day}`}
                                    className={classNames.join(" ")}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDateClick(day);
                                    }}
                                    style={{
                                        opacity: disabled ? 0.5 : 1,
                                        cursor: disabled ? 'not-allowed' : 'pointer',
                                    }}
                                >
                                    {day}
                                </li>
                            );
                        })}
                        {nextMonthDays.map((day, idx) => (
                            <li key={`next-${idx}`} className="inactive">
                                {day}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Calendar;
