# Pdf Calendar

## Contributors: 

Joseph Avendano

Cliff Vick

## Summary:

To make a user interface(command line or graphic) that produces a PDF of a calendar that is formatted to the users liking. The basic layout is always the same, but specifications on the display can be changed in the calendar PDF.

## Purpose:

To give users a simple and easy way of creating a calendar to their liking at the click of a mouse.

## MVP:

1. Every Calendar should have a Date in the header, as well as a mini display of the current and upcoming month.
2. Every calendar should have a body with a notes and time interval split down the middle.
3. Every calendar should have a footer with the time zone printed to the bottom left and a page count to the bottom right.
4. Users should be able to toggle on or off all of the above said visual settings.
5. The entire calendars line weight, margins, and layout(landscape or portrait) should be editable.

## Architecture and Design:

This is the general layout that we are hoping to achieve. Each individual square should have its own set of customizable views that the user could make. All calendars will have line weight adjustments, layout options, and margin spacing that effect the entire calendar.

### Header :

The header has most to do with the general date and time, with a subsection of preview, which is also optional for users. In the header it should at least the day, but the user can choose between seeing the month, year, week number, and however which way they want to display it. As for the preview, it should be togglable and have the option of showing a mix of any three of the previous, current, and next month.

### Body :

The body is where most of the users specified information will go. To the left there should be a time interval that defaults from 8am to 6pm. How the time interval displays should be completely up to the user. Another optional display would be whether or not it shows holidays. In the notes subsection, it should be a blank space for the user to put their own information in.

### Footer :

The footer is completely optional for displaying anything. The subsection, which is pages, is also optional. At the bottom left the user has the ability to show what time zone they are in and in the preview the user can have it show page numbers if they would like.

## Ex.

| Header (slug and week number) View Options: Day, month, year, week#, Font size, Font type, layout | Preview(Months) ViewOptions: 2, 1, or 0 of either previous, current or future. |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| Body(Time Slot) ViewOptions: Holiday, time interval(start and end) | Notes/misc viewOptions: All day events at the top, notes of particular time slots |
| Footer(time zone indicator) View Options: timeZone           | Pages ViewOptions:toggle page number showing                 |

# 

