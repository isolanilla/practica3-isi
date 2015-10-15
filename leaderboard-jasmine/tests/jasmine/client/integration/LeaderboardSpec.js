var selectGraceHopper = function (callback) {
  Session.set("selected_player", Players.findOne({name: "Grace Hopper"})._id);
  if (callback) {
    Deps.afterFlush(callback);
  }
};

var unselectPlayer = function () {
  Session.set("selected_player", null);
};

describe("Selecting Grace Hopper", function () {
  beforeEach(function (done) {
    Meteor.autorun(function (c) {
      var grace = Players.findOne({name: "Grace Hopper"});
      if (grace) {
        c.stop();
        selectGraceHopper(done);
      }
    })
  });

  it("should show Grace above the give points button", function () {
    expect($("div.details > div.name").html()).toEqual("Grace Hopper");
  });


  it("should highlight Grace's name", function () {
    var parentDiv = $("span.name:contains(Grace Hopper)").parent();
    expect(parentDiv.hasClass("selected")).toBe(true);
  });
});

describe("Point Assignment", function () {
  beforeEach(function (done) {
    selectGraceHopper(done);
  });
  afterAll(function(){
    if(!Players.findOne({name:"Grace Hopper"})){
      Players.insert({name:"Grace Hopper",score:20})
    }
  });

  it("should give a player 5 points when he is selected and the inc button is pressed", function () {
    var graceInitialPoints = Players.findOne({name: "Grace Hopper"}).score;
    $("#incrementar").click();
    expect(Players.findOne({name: "Grace Hopper"}).score).toBe(graceInitialPoints + 5);
  });
  it("should take a player 5 points when he is selected and the dec button is pressed", function () {
    var graceInitialPoints = Players.findOne({name: "Grace Hopper"}).score;
    $("#decrementar").click();
    expect(Players.findOne({name: "Grace Hopper"}).score).toBe(graceInitialPoints - 5);
  });
    it("should remove a player when he is selected and the remove button is pressed", function () {
    $("#remove").click();
    expect(Players.findOne({name: "Grace Hopper"})).toBe(undefined);
  });
});

  describe("pruebas con login logout", function () {
    beforeEach(function(done){
      Meteor.loginWithPassword("pepe@gmail.com", "123456", function(err){
        Tracker.afterFlush(done);
      });
    })

    afterEach(function(done){
      Meteor.logout(function() {
        Tracker.afterFlush(done);
      });
    });

    it("Add the new Player", function () {
      $('#textForm').val("ismael"); 
      $("#MyForm").submit()
      var name = Players.findOne({name:"ismael"}).name
      expect(name).toBe("ismael");
    });
  });

describe("Player Ordering", function () {
  it("should result in a list where the first player has as many or more points than the second player", function () {
    var players = PlayersService.getPlayerList().fetch();
    expect(players[0].score >= players[1].score).toBe(true);
  });
});
