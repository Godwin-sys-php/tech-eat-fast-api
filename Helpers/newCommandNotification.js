const Restaurants = require("../Models/Restaurants");
const fetch = require("node-fetch");

module.exports = async (idRestaurant) => {
  const restaurantInfo = await Restaurants.findOne({
    idRestaurant: idRestaurant,
  });
  const restaurantUsers = await Restaurants.customQuery(
    "SELECT * FROM usersRestaurant WHERE idRestaurant = ?",
    [idRestaurant]
  );

  for (let index in restaurantUsers) {
    if (restaurantUsers[index].notificationToken !== null) {
      console.log(restaurantUsers[index].notificationToken);
      const message = {
        to: restaurantUsers[index].notificationToken,
        sound: 'default',
        title: 'Nouvelle commande',
        body: 'Vous avez une nouvelle commande, venez la voir',
        channelId:	"commandReceiver",
      };
    
      await fetch('https://api.expo.dev/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
    }
  }
};
