"use strict";
var memberLocation = {lat: 0, lng: 0};

window.onload = function () {

	var htmlElementMember = document.getElementsByClassName("member_name");

	var friendsView = function () { //template for display friends
		document.querySelector(".search").classList.add("hide");
		document.querySelector(".title_and_sorter_container").classList.add("hide");
		document.getElementById("friendsButton").classList.add("hide");
		document.getElementById("member_info").classList.add("hide");
		document.getElementById("map").classList.add("hide");
		document.getElementById("back").classList.remove("hide");
		document.getElementById("back_friends").classList.remove("hide");
		document.getElementById("member_friends").classList.remove("hide");
	}

	var statisticsView = function () { //template for display statistics
		if (window.innerWidth > 991) { // if screen width > 991
			document.querySelector(".search").classList.add("hide");
			document.querySelector(".title_and_sorter_container").classList.add("hide");
			document.getElementById("map").classList.add("hide");
			document.getElementById("back_friends").classList.add("hide");
			document.getElementById("members_list").classList.add("hide");
			document.getElementById("member_info").classList.add("hide");
			document.getElementById("statisticsButton").classList.add("hide");
			document.getElementById("member_friends").classList.add("hide");;
			document.getElementById("friendsButton").classList.add("hide");
			document.getElementById("back").classList.remove("hide");
			document.getElementById("statistics").classList.remove("hide");

		} else {
			document.querySelector(".search").classList.add("hide");
			document.querySelector(".title_and_sorter_container").classList.add("hide");
			document.getElementById("map").classList.add("hide");
			document.getElementById("back_friends").classList.add("hide");
			document.getElementById("members_list").classList.add("hide");
			document.getElementById("statisticsButton").classList.add("hide");
			document.getElementById("member_friends").classList.add("hide");;
			document.getElementById("friendsButton").classList.add("hide");
			document.getElementById("back").classList.remove("hide");
			document.getElementById("statistics").classList.remove("hide");
		}
	}

	var lastSelected = document.querySelector(".member_name");

	var selectedView = function () { //template for display a member informations

		if (this.id !== "back_friends") { //to be sure getMember and memberLocator never 
											//runs if button member_info is clicked

			var getMember = function (clicked) {	//to find member name
				return clicked.querySelectorAll('td')[1].innerHTML + " " + clicked.querySelectorAll('td')[0].innerHTML
			};

			var memberLocator = function (arg) {	//to find member in database comparing his name
				for (let i = 0; i < database.length; i++) {
					if (getMember(arg).toLowerCase() == database[i].name.toLowerCase()) {
						return {lat: database[i].latitude, lng: database[i].longitude}
					}
				}
			};


			memberLocation = memberLocator(this);
		}

		initMap(); //to launch map api

		lastSelected.classList.remove("selected");	//
		this.classList.add("selected");				//to switch background and text color of selected
		lastSelected = this;						//

		document.querySelector(".search").classList.add("hide");
		document.querySelector(".title_and_sorter_container").classList.add("hide");
		document.getElementById("members_list").classList.add("hide");
		document.getElementById("statisticsButton").classList.add("hide");
		document.getElementById("back_friends").classList.add("hide");
		document.getElementById("member_friends").classList.add("hide");
		document.getElementById("back").classList.remove("hide");
		document.getElementById("member_info").classList.remove("hide");
		document.getElementById("friendsButton").classList.remove("hide");

		if (window.innerWidth > 991) {
			document.getElementById("map").classList.remove("hide");
			document.querySelector(".search").classList.remove("hide");
			document.querySelector(".title_and_sorter_container").classList.remove("hide");
			document.getElementById("members_list").classList.remove("hide");
			document.getElementById("statisticsButton").classList.remove("hide");
			document.getElementById("back_friends").classList.add("hide");
			document.getElementById("member_friends").classList.remove("hide");
			document.getElementById("back").classList.add("hide");
			document.getElementById("member_info").classList.remove("hide");
			document.getElementById("friendsButton").classList.add("hide");
		}
	};

	var homeView = function () {	//template of home view

		if (window.innerWidth > 991) {
			document.getElementById("map").classList.remove("hide");
			document.getElementById("back_friends").classList.add("hide");
			document.getElementById("member_friends").classList.remove("hide");
			document.getElementById("member_info").classList.remove("hide");
			document.getElementById("back").classList.add("hide");
			document.getElementById("statistics").classList.add("hide");
			document.getElementById("friendsButton").classList.add("hide");
			document.querySelector(".search").classList.remove("hide");
			document.querySelector(".title_and_sorter_container").classList.remove("hide");
			document.getElementById("members_list").classList.remove("hide");
			document.getElementById("statisticsButton").classList.remove("hide");
			document.getElementById("members_list").insertBefore(document.getElementById("sorter"), document.querySelector(".table_head"));

		} else {
			document.getElementById("map").classList.add("hide");
			document.getElementById("back_friends").classList.add("hide");
			document.getElementById("member_friends").classList.add("hide");
			document.getElementById("member_info").classList.add("hide");
			document.getElementById("back").classList.add("hide");
			document.getElementById("statistics").classList.add("hide");
			document.getElementById("friendsButton").classList.add("hide");
			document.querySelector(".search").classList.remove("hide");
			document.querySelector(".title_and_sorter_container").classList.remove("hide");
			document.getElementById("members_list").classList.remove("hide");
			document.getElementById("statisticsButton").classList.remove("hide");
		}
	}

	var genderStat = function () { //returns array of the count of male/female members
		var femaleCount = 0;
		var maleCount = 0;
		var gender = "";
		for (let i = 0; i < database.length; i++) {
			gender = database[i].gender;

			if (gender === "female") {
				femaleCount++;
			} else {
				maleCount++
			};
		};
		return [maleCount,femaleCount];
	};

	var activityStat = function () { //returns array of the count of active/non-active members
		var active = 0;
		var nonActive = 0;
		for (let i = 0; i < database.length; i++) {
			
			if (database[i].isActive) {
				active++;
			} else {
				nonActive++
			};
		};
		return [nonActive,active];
	};

	var ageStat = function () { //returns array of ages rate
		var ageCount_25less = 0;
		var ageCount_26_35 = 0;
		var ageCount_36more = 0;
		var age = 0;

		for (let i = 0; i < database.length; i++) {
			age = database[i].age;

			if (age < 26) {
				ageCount_25less++;
			} else if (age >= 26 && age <= 35) {
				ageCount_26_35++;
			} else {
				ageCount_36more++;
			}
		};
		return [ageCount_25less, ageCount_26_35, ageCount_36more];
	};

	var stat_1 = document.getElementById('stat_1');
	new Chart(stat_1, {
		type: 'doughnut',
		data: {
			labels: ["Hommes", "Femmes"],
			datasets: [
			{
				label: "Proportion Femmes/Hommes",
				backgroundColor: ["#3e95cd","#8e5ea2"],
				data: genderStat()
			}]
		}
	});

	var stat_2 = document.getElementById('stat_2');
	new Chart(stat_2, {
		type: 'doughnut',
		data: {
			labels: ["Non-actifs", "Actifs"],
			datasets: [
			{
				label: "Taux d'activté",
				backgroundColor: ["#555","#ff5555"],
				data: activityStat()
			}]
		}
	});

	var stat_3 = document.getElementById('stat_3');
	new Chart(stat_3, {
		type: 'bar',
		data: {
			labels: ["-26", "26/35", "+35"],
			datasets: [
			{
				label: "Proportion des âges",
				backgroundColor: [
				'rgba(255, 99, 132, 0.8)',
				'rgba(54, 162, 235, 0.8)',
				'rgba(255, 206, 86, 0.8)'
				],
				data: ageStat()
			}]
		}
	});

	var sorter = function (_toSort, type, by, useSplitReverse) {	//function to sort the table
		var toSort = JSON.parse(JSON.stringify(_toSort));
		var nextName = "";
		var currentName = "";
		toSort.sort((next, current) => {
			
			nextName = next[by];
			currentName = current[by];

			if (useSplitReverse) {
				nextName = next[by].split(" ").reverse().join();
				currentName = current[by].split(" ").reverse().join();
			}

			if (nextName < currentName) {
				return -type;
			} else if (nextName > currentName) {
				return type;
			}
			return 0;
		});

		return toSort;
	};

	var updateMembersListHeadSize = function () {	//to update the table head size of the members list table
		var width = 0;								//in order to align titles of thead with tbody elements
		var parentWidth = 0;
		var membersListHeadSize = 0;
		var lastTd = document.querySelector(".table_head td:last-of-type");
		var tBody = document.querySelector(".table_body");
		var tBodyParent = tBody.parentElement;
		width = tBody.offsetWidth;
		parentWidth = tBodyParent.offsetWidth;
		membersListHeadSize = parentWidth - width - 4;
		lastTd.style.width = membersListHeadSize + "px";
	};

	var membersList = new Vue({ 
		el: "#main_vue",
		data: {
			search: "",
			member: database[0],
			by: "",
			friendsDisplay: false
		},
		computed: {
			filterName: function () {	//searched entry's name
				return this.membersData.filter(_member => _member.name.toLowerCase().includes(this.search.toLowerCase()))
			},
			membersData: function () {	//sorted database
				var useSplitReverse = true;
				(this.by === "name")? useSplitReverse = true : useSplitReverse = false;
				return sorter(database, 1, this.by, useSplitReverse)
			}
		},
		methods: {
			friendsDisplayer: function () {
				this.friendsDisplay = true;
			},
			memberSelection: function (item) {	//focus and update member
				this.member = item;
			},
			name: (item) => item.name.split(" ")[1],
			firstname: (item) => item.name.split(" ")[0],
			registered: (item) => String(item.registered).split("T")[0].split("-").reverse().join("-")
		},
		mounted: function () {
			setTimeout(() => {
				updateMembersListHeadSize();
			}, 0);
		}
	});

	homeView();
	document.getElementById("body").classList.remove("hide");

	for (let i = 0; i < htmlElementMember.length; i++) {
		htmlElementMember[i].addEventListener("click", selectedView);
	};

	document.getElementById("back").addEventListener("click", homeView);
	document.getElementById("back_friends").addEventListener("click", selectedView);
	document.getElementById("statisticsButton").addEventListener("click", statisticsView);
	document.getElementById("friendsButton").addEventListener("click", friendsView);
}