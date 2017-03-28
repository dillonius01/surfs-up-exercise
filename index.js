$(function() {
	var SurferSentenceBuilder = {
  	init: function() {
    	this.setupEventHandlers();
    },

    setupEventHandlers: function() {
      $('#btn-add').on('click', this.addDropdown.bind(this));
      $('#btn-delete').on('click', this.removeDropdown.bind(this));
      $('#btn-go').on('click', this.handleGo.bind(this));
      $('#btn-stop').on('click', this.handleStop.bind(this));
    },

   	addDropdown: function() {
      $('.dropdown:last-child')
        .clone()
        .appendTo('#dropdown-container');
    },

    removeDropdown: function() {
      var $dropdowns = $('.dropdown');
      var len = $dropdowns.length;
      if (len > 1) { // remove only if 1 or more
        $dropdowns[len - 1].remove();
      }
    },

    addFetchedWord: function(word, index) {
      this.fetchedWords[index] = word;
      this.refreshCanvas();
    },

    closureAddFetchedWord: function(index) {
      return word => this.addFetchedWord(word, index);
    },

    collectWordsFromAPI: function(wordTypes) {
      return wordTypes.map((type, index) => {
        var callback = this.closureAddFetchedWord(index);
        return getRandomWordFromAPI(type, callback)
      })
    },

    setCanvas: function(wordStr) {
      $('#canvas').text(wordStr)
    },

    clearFetchedWords: function() {
      this.fetchedWords = [];
    },

    refreshCanvas: function() {
      var wordStr = this.makeWordStr(this.fetchedWords);
      this.setCanvas(wordStr);
    },

    makeWordStr: function(wordArr) {
      return wordArr
      .map((word, index) => {
        if (!index && word[0]) {
          word = word[0].toUpperCase() + word.slice(1);
        }
        if (index === wordArr.length - 1) {
          word += '!';
        }
        return word
      })
      .join(' ')
    },

    handleGo: function() {
      var wordTypes = this.getSelectedWordTypes();

      this.setCanvas('');
      this.clearFetchedWords();
      this.apiTimeouts = this.collectWordsFromAPI(wordTypes);
    },

    getSelectedWordTypes: function() {
      return Array.from($('select option:selected'))
        .map(ele => ele.value)
    },

    handleStop: function() {
      this.apiTimeouts.forEach(timer => clearTimeout(timer));
      this.apiTimeouts = [];
    },

    fetchedWords: [],
    apiTimeouts: []
  };
  
  SurferSentenceBuilder.init();
});

// don't edit the API!
function getRandomWordFromAPI(type, callback) {
	return setTimeout(function() {
  	callback(
    	type in dictionary ?
      	_.sample(dictionary[type]) :
        null
    );
  }, (Math.random() * 750 + 250));
}

// augment for extra credit (and fun!)
var dictionary = {
	adjective: ['bogus', 'boss', 'gnarlatious', 'hairy', 'outrageous', 'rad', 'stoked'],
  adverb: ['bogusly', 'gnarlatiously', 'tubularly'],
	article: ['a', 'the'],
  conjuction: ['and', 'but'],
  interjection: ['banzai', 'cowabunga'],
  noun: ['barrel', 'bro', 'bummer', 'dude', 'green room', 'honker', 'neptune cocktail', 'surfari'],
  verb: [ 'bailed out', 'maxed out', 'shredded', 'tubed', 'wiped out']
};