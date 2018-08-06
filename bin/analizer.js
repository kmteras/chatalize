function analize(chatData) {
    let analized = {
        dailyCount: {},
        monthlyCount: {},
        totalCount: {}
    };

    let total = chatData['messages'].length;

    let currentTime = new Date();
    let currentMonthlyDate = currentTime.toISOString().substr(0, 7);
    let currentDailyDate = currentTime.toISOString().substr(0, 10);

    if (analized.monthlyCount[currentMonthlyDate] === undefined) {
        analized.monthlyCount[currentMonthlyDate] = 0;
    }

    if (analized.dailyCount[currentDailyDate] === undefined) {
        analized.dailyCount[currentDailyDate] = 0;
    }

    analized.totalCount[currentDailyDate] = total;

    for (let i = 0; i < chatData['messages'].length; i++) {
        let time = new Date(chatData['messages'][i]['timestamp_ms']);
        let monthlyDate = time.toISOString().substr(0, 7);
        let dailyDate = time.toISOString().substr(0, 10);

        const currentDailyCount = analized.dailyCount[dailyDate];
        const currentMonthlyCount = analized.monthlyCount[monthlyDate];

        if (currentDailyCount === undefined) {
            analized.dailyCount[dailyDate] = 1;
        }
        else {
            analized.dailyCount[dailyDate]++;
        }

        if (currentMonthlyCount === undefined) {
            analized.monthlyCount[monthlyDate] = 1;
        }
        else {
            analized.monthlyCount[monthlyDate]++;
        }

        analized.totalCount[dailyDate] = total;
        total--;
    }

    return analized;
}

function analizeList(chatData) {
    const map = analize(chatData);
    let analized = {
        dailyCount: [],
        monthlyCount: [],
        totalCount: []
    };

    for (const dc in map.monthlyCount) {
        analized.monthlyCount.push({
            date: dc,
            count: map.monthlyCount[dc]
        });
    }

    for (const dc in map.dailyCount) {
        analized.dailyCount.push({
            date: dc,
            count: map.dailyCount[dc]
        });
    }

    for (const dc in map.totalCount) {
        analized.totalCount.push({
            date: dc,
            total: map.totalCount[dc]
        });
    }
    return analized;
}

function getMessageCount(chatJson) {
    return chatJson['messages'].length;
}

function getMessageCountByPerson(chatJson) {
    let participants = chatJson.participants;
    console.log(participants);
    return participants;
}

function addParticipantsObject(chatJson) {
    for (let chat in chatJson) {
        let participantsString = "";
        let participants = chatJson[chat].participants;

        if (participants === undefined) {
            chatJson[chat].participantsString = "Unknown";
            continue;
        }

        for (let i = 0; i < participants.length; i++) {
            participantsString += participants[i];
            if (i + 1 < participants.length) {
                participantsString += ", "
            }
        }
        chatJson[chat].participantsString = participantsString;
    }
}

function chatDataToList(cd) {
    let list = [];
    for (let key in cd) {
        list.push({
            fileName: key,
            title: cd[key]['title'],
            messageCount: cd[key]['messages'].length,
            participants: cd[key].participantsString
        });
    }
    return list;
}

module.exports = {
    analize,
    analizeList,
    getMessageCount,
    chatDataToList,
    getMessageCountByPerson,
    addParticipantsObject
};
