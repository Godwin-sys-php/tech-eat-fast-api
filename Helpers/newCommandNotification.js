const Restaurants = require("../Models/Restaurants");
const fetch = require("node-fetch");

module.exports = async (idRestaurant) => {
    const restaurantInfo = await Restaurants.findOne({ idRestaurant: idRestaurant });
    const restaurantUsers = await Restaurants.customQuery("SELECT * FROM usersRestaurant WHERE idRestaurant = ?", [idRestaurant]);

    for (let index in restaurantUsers) {
        if (restaurantUsers[index].notificationToken !== null) {
            console.log(restaurantUsers[index].notificationToken);
            const a = await fetch('https://fcm.googleapis.com/fcm/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `key=AAAA1Wlnc64:APA91bF52eGpUQGAQBpsAOIlUvxnvmh00rnhXMN-YoZefUR7_jTIFk_Y3r3ODzom_WnFWNpnc2jIoxOdmK9asNNcMtsRBeTgtdxBcjqSLgwJNks3afmTDadyGaQXRMmNESaElWLFH12P`,
                },
                body: JSON.stringify({
                    to: restaurantUsers[index].notificationToken,
                    priority: 'high',
                    data: {
                        token: restaurantUsers[index].notificationToken,
                        experienceId: '@nodewin/tefp',
                        title: "Nouvelle commande " + restaurantInfo.name,
                        message: 'Vous avez une nouvelle commande venez la voir',
                        channelId: "commandReceiver",
                        priority: "max",
                    },
                }),
            });
            console.log(await a.json());
        }
    }
}