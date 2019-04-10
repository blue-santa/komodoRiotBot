// Require node modules
const tz = require('timezone/loaded')
const equal = require('assert').equal
const humanizeDuration = require('humanize-duration')

/******************/
/* Set up project */
/******************/

// Define absolute variables
const origin = new Date('Tue Apr 1 2019 16:00:00 GMT-0000 (UTC)')

const schedule = [
    {
        "title":    "Monday Marketing Meeting",
        "time":     "Tue Apr 1 2019 16:00:00 GMT-0000 (UTC)"
    },
    {
        "title":    "Tuesday Team Meeting",
        "time":     "Wed Apr 2 2019 16:00:00 GMT-0000 (UTC)"
    },
    {
        "title":    "IBN Standup",
        "time":     "Wed Apr 2 2019 17:00:00 GMT-0000 (UTC)"
    },
    {
        "title":    "Wednesday Marketing Meeting",
        "time":     "Wed Apr 3 2019 16:00:00 GMT-0000 (UTC)"
    },
    {
        "title":    "Thursday Marketing Meeting",
        "time":     "Thu Apr 4 2019 16:00:00 GMT-0000 (UTC)"
    },
    {
        "title":    "Thursday IBN Standup",
        "time":     "Thu Apr 4 2019 15:00:00 GMT-0000 (UTC)"
    },
    {
        "title":    "Thursday Wachsman",
        "time":     "Thu Apr 4 2019 16:00:00 GMT-0000 (UTC)"
    }
]

// Define empty variables for later calculations
let weeksMeetings = []
let nextThree = []
let current, diffTime, diffDay, weeks
let res
let nextDate

/********************/
/* Set up functions */
/********************/

// Reset all variables for the next calculation
const resetTimes = function() {

    // Set the current time
    current = new Date()
    console.log(`Current Time: ${current}`)

    // Discover how much time has passed since April 1, 2019
    diffTime = Math.abs(current.getTime() - origin.getTime())
    diffDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    weeks = Math.floor(diffDay / 7)

    // Ensure that all upcoming variables are reset to null values
    weeksMeetings = []
    nextThree = []
    nextDate = ''
    res = ''
}

// Calculate the base variables for current time and upcoming meetings
const loadWeeklyMeetings = function() {

    // For each meeting, discover the occurence during this week
    // Add this value to the weeksMeetings variable
    schedule.forEach((meeting) => {
        nextDate = new Date(meeting.time)
        nextDate = nextDate.setDate(nextDate.getDate() + 7 * weeks)
        weeksMeetings.push({"title": meeting.title, "time": nextDate})
        return
    })
}

// For the passed meeting time, discover the amount of time until the next occurence
// Humanize this amount of time
const calcRemainingTime = function(nextMeeting) {
    let totalMill = nextMeeting - current
    return humanizeDuration(totalMill, {largest: 2 })
}

// Filter through the upcoming meetings to discover which three are next
const discoverNextThree = function() {
    weeksMeetings.forEach((meeting) => {
        console.log(`Meeting time: ${meeting.time}\n`)
        console.log(`Current time: ${current}\n\n`)

        if (meeting.time < current) return

        else if (nextThree.length < 3) {
            
            remainingTime = calcRemainingTime(meeting.time)

            nextThree.push({"title": meeting.title, "calculation": remainingTime })

        }
    })
}

module.exports = {

    assembleValues(callback) {
        // Reset the times
        try {
            resetTimes()
        }
        catch(err) {
            return callback(err, null)
        }

        // Load weekly meetings
        try {
            loadWeeklyMeetings()
        }
        catch(err) {
            return callback(err, null)
        }

        // Discover the next three meetings
        try {
            discoverNextThree()
        }
        catch(err) {
            return callback(err, null)
        }

        // Build the response
        try {
            nextThree.forEach((meeting) => {
                res = res + `<p>${meeting.title}<br>${meeting.calculation}</p>`
            })
        }
        catch(err) {
            return callback(err, null)
        }

        // Response for export
        callback(null, res)
    },

}
