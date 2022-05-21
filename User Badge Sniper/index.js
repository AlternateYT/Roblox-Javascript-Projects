const noblox = require('noblox.js')
const config = require('./config.json')
const colors = require('colors')
const notifier = require('node-notifier')
const open = require('open')
var userID = config.UserID

var badges
var infBadges
var badgeCount = 0
var preBadgeCount = 0

async function run() {
    infBadges = await noblox.getPlayerBadges(parseInt(userID), 1e9, "Asc")
    preBadgeCount = badgeCount
    badgeCount = 0
    for (var badge in infBadges) {
        badgeCount++
    }
    if (badgeCount != preBadgeCount) {
        const username = await noblox.getUsernameFromId(parseInt(userID))
        console.log(`${username} earned a badge!`.green.bold)
        notifier.notify(
            {
                title: 'Player earned a badge',
                subtitle: 'Badge earned',
                icon: './err.png',
                message: `${username} has earned a badge!`,
            }
        )
    }
    setTimeout(run, 5000)
}

notifier.on('click', async function() {
    await open(`https://www.roblox.com/users/${parseInt(userID)}/profile`)
});

async function load() {
    var userExists = true
    try {
        badges = await noblox.getPlayerBadges(parseInt(userID), 250, "Asc")
        infBadges = await noblox.getPlayerBadges(parseInt(userID), 1e9, "Asc")
    } catch {
        userExists = false
        console.log("Failed to load user, likely caused by server overflow.".red.bold)
    }
    if (userExists) {
        var totalBadges = 0
        for (var badge in badges) {
            totalBadges++
        }
        if (totalBadges >= 1) {
            console.log("\n")
            badges.forEach(function (badge, index) {
                console.log(`\nLoaded badge "${badge.name}" (${badge.id})`.cyan)
                console.log(`Queue: ${index+1}/${totalBadges}\n`)
            });
            console.log("\n")
            if (totalBadges >= 250) {
                console.log(`Process finished, rest of the badges failed to load due to the limited condition being met. Loaded ${totalBadges} badges.`.yellow.bold)
            } else {
                console.log(`Process finished, loaded ${totalBadges} badge(s).`.green.bold)
            }
        } else {
            console.log("Failed to load badges, no badges available.".red.bold)
        }
        setTimeout(run, 3000)
        console.log("Loaded badge sniper!".green.bold)
    }
}

async function preLoad() {
    var userExists = true
    try {
        infBadges = await noblox.getPlayerBadges(parseInt(userID), 1e9, "Asc")
    } catch {
        userExists = false
        console.log("User does not exist!".red.bold)
    }
    if (userExists) {
        for (var badge in infBadges) {
            badgeCount++
        }
        console.log(`\nLoading ${badgeCount} badge(s)..`.green.bold)
        setTimeout(load, 1500)
    }
}

preLoad()
