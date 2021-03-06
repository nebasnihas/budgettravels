import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http'
import {Cities} from "../lib/collection";
import {Attractions} from "../lib/collection";
import {Budgets} from "../lib/collection"


Meteor.startup(() => {
    ServiceConfiguration.configurations.remove({
        service: "facebook"
    });

    ServiceConfiguration.configurations.insert({
        service: "facebook",
        appId: '342797886216102',
        secret: 'e5073e13cde8388d197c331f758ec8cd'
    });


  // code to run on server at startup

    //populate cities db


  // getCities();
});


function getCities() {

    // this.unblock();

    var result;

    try {
       result = HTTP.call('GET', 'https://pure-coast-27115.herokuapp.com/data/cities');

        //console.log(result['data']['data']);

    } catch (e) {
        // Got a network error, timeout, or HTTP error in the 400 or 500 range.
       console.log(e)
    }

    var cityArr = result['data']['data'];
    for(var i=0; i<cityArr.length;i++){
        //console.log(cityArr[i].name);
        var name = cityArr[i].name;
        var country = cityArr[i].country;
        var cityId = cityArr[i].id;
        console.log(name + " " + country);
       Cities.insert({name:name,country:country, cityId:cityId});
    }
}

Meteor.methods({

    ddb(){
        Budgets.remove({});
    },

    getSchedule(cid,budget,days, daynight, indout){
        Budgets.remove({});
        var uri = "https://cryptic-dawn-72809.herokuapp.com/create_schedule/?city_id=" + cid + "&budget=" + budget + "&days=" + days +
                            "&day_night=" + daynight +  "&indoor_outdoor=" + indout;
        var response = HTTP.call( 'GET', uri, {} );
        console.log(response);
        var index = 1;
        for(var i = 0; i < Object.keys(response ["data"]).length; i ++){
            if(i % 2 != 0){
                var str = "Day " + index;
                index++;
                var ResponseInJSON = JSON.parse(response ["data"][str]);

                var len = Object.keys(ResponseInJSON).length;
                console.log(len);
                for(var j = 0; j < len; j++){
                    var obj = {
                        title: ResponseInJSON[j].fields.title,
                        price: ResponseInJSON[j].fields.price,
                        day: str
                    };
                    Budgets.insert(obj);
                }
                // var obj = {
                //     title: ResponseInJSON[0].fields.title,
                //     price: ResponseInJSON[0].fields.price,
                //     day: str
                // };
                // Budgets.insert(obj);
            }
        }
        return response;
    },

    getAttractions(url) {
        var result;
        try {
            result = HTTP.call('GET', url);
        } catch (e) {
            // Got a network error, timeout, or HTTP error in the 400 or 500 range.
            console.log(e);
        }
        // console.log(result);
        return result.data;
    },

    getAttractionsWithSearchQuery(url, query) {
        var result;
        var resultWithSearchQuery = [];
        try {
            result = HTTP.call('GET', url);
        } catch (e) {
            // Got a network error, timeout, or HTTP error in the 400 or 500 range.
            console.log(e);
        }
        // console.log(result);

        var index = 0;
        for(var i = 0; i < result.data.length; i++){
            var str = result.data[i].fields.title;
            var n = str.toLowerCase().search(query);
            // console.log(n);
            if(n >= 0){
                resultWithSearchQuery[index] = result.data[i];
                index++;
            }
        }
        return resultWithSearchQuery;
    },

    populateDb(url){
        var result;
        try {
            result = HTTP.call('GET', url);
        } catch (e) {
            // Got a network error, timeout, or HTTP error in the 400 or 500 range.
            console.log(e);
        }

        for(var i = 0; i < result.data.length; i++){
            var attraction = {

            }
        }
    }
});
