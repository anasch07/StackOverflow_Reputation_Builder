// this function takes the question object returned by the StackOverflow request
// and returns new result to be appended to DOM
var showQuestion = function(question) {

    // clone our result template code
    var result = $('.templates .question').clone();

    // Set the question properties in result
    var questionElem = result.find('.question-text a');
    questionElem.attr('href', question.link);
    questionElem.text(question.title);

    // set the date asked property in result
    var asked = result.find('.asked-date');
    var date = new Date(1000 * question.creation_date);
    asked.text(date.toString());

    // set the .viewed for question property in result
    var viewed = result.find('.viewed');
    viewed.text(question.view_count);

    // set some properties related to asker
    var asker = result.find('.asker');
    asker.html('<p>Name: <a target="_blank" ' +
        'href=http://stackoverflow.com/users/' + question.owner.user_id + ' >' +
        question.owner.display_name +
        '</a></p>' +
        '<p>Reputation: ' + question.owner.reputation + '</p>'
    );

    return result;
};


// this function takes the results object from StackOverflow
// and returns the number of results and tags to be appended to DOM
var showSearchResults = function(query, resultNum) {
    var results = resultNum + ' results for <strong>' + query + '</strong>';
    return results;
};

// takes error string and turns it into displayable DOM element
var showError = function(error) {
    var errorElem = $('.templates .error').clone();
    var errorText = '<p>' + error + '</p>';
    errorElem.append(errorText);
};

// takes a string of semi-colon separated tags to be searched
// for on StackOverflow
var getUnanswered = function(tags) {

    // the parameters we need to pass in our request to StackOverflow's API

    var request = {
        tagged: tags,
        site: 'stackoverflow',
        order: 'desc',
        sort: 'creation'
    };

    var result = $.ajax({
            url: "https://api.stackexchange.com/2.2/questions/unanswered",
            data: request,
            dataType: "jsonp",
            type: "POST",
        })
        .done(function(result) { //this waits for the ajax to return with a succesful promise object
            var searchResults = showSearchResults(request.tagged, result.items.length);
            $('.search-results').html(searchResults);
            //$.each is a higher order function. It takes an array and a function as an argument.
            //The function is executed once for each item in the array.
            $.each(result.items, function(i, item) {
                var question = showQuestion(item);
                $('.results').append(question);
            });
        })
        .fail(function(jqXHR, error) { //this waits for the ajax to return with an error promise object
            var errorElem = showError(error);
            $('.search-results').append(errorElem);
        });
};



//---------------------------

function showAnswerer(answerer) {
    // clone our result template code
    var result = $('.templates .answerer').clone();
    var user = answerer.user;
    console.log(user);
    // Set image link
    var imgLink = result.find(".profile-img-link");
    imgLink.attr("href", user.link);

    // Set the user's profile image
    var userImage = result.find(".profile-img");
    userImage.attr("src", user.profile_image);
    userImage.attr("alt", user.display_name + " profile image");

    //Set the user information
    var userName = result.find(".user-name");
    userName.html("<a target='_blank' href='" + user.link + "'>" + user.display_name + "</a>");

    var reputation = result.find(".reputation");
    reputation.text("Reputation: " + user.reputation);

    var postCount = result.find(".post-count");
    postCount.text("Post Count: " + answerer.post_count);

    return result;
}



function ViewTopAnswer(tag) {
    //The parameter we need to pass in ou request to stackoverflow's api
    var request = {
        site: "stackoverflow",
        order: 'desc',
        sort: 'creation'
    };
    var result = $.ajax({
        type: "GET",
        dataType: "jsonp",
        url: "https://api.stackexchange.com/2.2/tags/" + tag + "/top-answerers/month",
        data: request
    }).done(function(result) {
        console.log(result);
        var searchResults = showSearchResults(tag, result.items.length);
        $('.search-results').html(searchResults);
        $.each(result.items, function(indexInArray, valueOfElement) {
                var answer = showAnswerer(valueOfElement);
                $(".results").append(answer);

            })
            .fail(function(jqXHR, error, errorThrown) {
                var errorElem = showError(error);
                $('.search-results').append(errorElem);
            });
        s

    })

    ;
}


//EVENT LISTENNERS
$(document).ready(function() {
    $('.unanswered-getter').submit(function(e) {
        e.preventDefault();
        // zero out results if previous search has run
        $('.results').html('');
        // get the value of the tags the user submitted
        var tags = $(this).find("input[name='tags']").val();
        console.log(tags);
        getUnanswered(tags);
    });
    $(".inspiration-getter").submit(function(e) {
        e.preventDefault();
        //zero out results if previous search has run
        $('.results').html('');
        var tag = $('#answerers').val();
        ViewTopAnswer(tag);
    });
});