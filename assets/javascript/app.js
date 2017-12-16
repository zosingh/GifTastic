$(document).ready(function() {
    renderDom();
    addHeroButton();
    addGifs();
    startOrPauseGifs();
});

// list of topics for buttons
var topics = [
    'Goku', 'Vegeta', 'Gohan', 'Trunks', 'Piccolo', 
    'Gotenks'
];

// render base DOM
function renderDom() {
    // need a container
    var container = $('<div>').addClass('container');
    // append the container to the body
    $('body').append(container);
    // add an area for the buttons
    container.append($('<div>').attr('id', 'buttonArea'));
    // add all the default buttons
    addButtons();
    // add form to add buttons
    addHeroAdderForm();
    // add area
    container.append($('<div>').attr('id', 'gifArea'));
}

function addButtons() {
    // empty out the buttons so that I'm not appending to the old ones
    $('#buttonArea').empty();
    // for all the topics in the topics array, add a button
    for (var i = 0; i < topics.length; i++) {
        // append them to the button area
        $('#buttonArea').append(
            // give it the primary class and hero-button class for style and
            // use later
            $('<button>').addClass('btn btn-primary hero-button')
            // add a data attribute with the topic for later use
            .attr('data-topic', topics[i])
            // the text of the button is the topic
            .text(topics[i])
        );
    }
}

function addHeroAdderForm() {
    // create form
    var heroAdder = $('<form>');
    // add the label for the button addition input
    heroAdder.append($('<label>').attr('for', 'addHero').text('Add a hero:'))
        // add button addition input
        .append(
            $('<input>').addClass('form-control')
            .attr('type', 'text')
            .attr('id', 'addHero')
        )
        // add a submit button so we can submit the text for button addition
        .append($('<button>').addClass('btn btn-info add-hero').text('Add'));
    // add the form to the container
    $('.container').append(heroAdder);
}

function addHeroButton() {
    // when the add-hero button is clicked
    $('.add-hero').on('click', function() {
        // push the value to the topics array
        topics.push($('#addHero').val().trim());
        // re-render all the buttons
        addButtons();
        // clear the input -- this is because I am using `return false` so the
        // page does not reload
        $('#addHero').val('');
        return false;
    });
}

function addGifs() {
    // on click of a hero-button
    $(document).on('click', '.hero-button', function() {
        // the search term is the topic contained in the data-topic attribute
        // replace spaces with pluses
        var searchTerm = $(this).data('topic').replace(' ', '+');
        // the url for querying -- the `q` is for the query and `limit=10` keeps
        // the amount of gifs returned to a manageable 10
        var queryURL = 'https://api.giphy.com/v1/gifs/search?q=' +
            searchTerm + '&limit=10&api_key=dc6zaTOxFJmzC';
        // hit up giphy for some gifs
        $.ajax({
            url: queryURL,
            method: 'GET'
        }).done(function(response) {
            // empty the gifArea so I am not adding to the old stuff
            $('#gifArea').empty();
            // all the gifs sent back to us
            for (var i = 0; i < response.data.length; i++) {
                // append to the gifArea
                $('#gifArea').append(
                    // pull-left for prettier display, addImage is defined below
                    $('<div>').addClass('pull-left').html(addImage(response, i))
                    // append the rating of this particular gif
                    .append($('<p>').text('rating: ' + response.data[i].rating))
                );
            }
        });
    });
}

function addImage(response, i) {
    // define the url for the images -- I use this a few times below
    var image_url = response.data[i].images.fixed_height.url;
    // return the image html for appending above -- the src is the still version
    return $('<img>').attr('src', image_url.replace('.gif', '_s.gif'))
        // add the data-still attribute and set the still url to it
        .attr('data-still', image_url.replace('.gif', '_s.gif'))
        // add the data-animate attribute and set the url to it
        .attr('data-animate', image_url)
        // add the data-state attribute, set it to still by default
        .attr('data-state', 'still');
}

function startOrPauseGifs() {
    // on click of an image
    $(document).on('click', 'img', function() {
        // add variable of state since I use it a lot below
        var state = $(this).attr('data-state');
        // if state is 'still'
        if (state == 'still') {
            // make the gif animate
            $(this).attr('src', $(this).data('animate'));
            // set the state to animate
            $(this).attr('data-state', 'animate');
        } else {
            // make the gif still
            $(this).attr('src', $(this).data('still'));
            // set the state to still
            $(this).attr('data-state', 'still');
        }
    });
}