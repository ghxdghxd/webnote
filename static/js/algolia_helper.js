// Algolia client. Mandatory to instantiate the Helper.
var algolia = algoliasearch(applicationID, apiKey);

// Algolia Helper
var helper = algoliasearchHelper(algolia, indexName, {
  facets: ['tags'],
  disjunctiveFacets: ['category'],
});

var name_json = { 
  "tags": "标签", 
  "category": "分类"
}

// Bind the result event to a function that will update the results
helper.on("result", searchCallback);

// The different parts of the UI that we want to use in this example
var $inputfield = $("#searchBox");
var $hits = $('#hits');
var $facets = $('#facets');
var $disjunctiveFacets = $('#disjunctiveFacets');
var $currentRefinements = $('#currentRefinements')

$facets.on('click', handleFacetClick);
$disjunctiveFacets.on('click', handleFacetClick);
$currentRefinements.on('click', handleFacetClick);

// Trigger a first search, so that we have a page with results
// from the start.
helper.search();

// When there is a new character input:
// - update the query
// - trigger the search
$inputfield.keyup(function (e) {
  helper.setQuery($inputfield.val()).search();
});

// Result event callback
function searchCallback(results) {
  renderCurrentRefinements($currentRefinements, results);
  if (results.hits.length === 0) {
    // If there is no result we display a friendly message
    // instead of an empty page.
    $hits.empty().html("No results :(");
    return;
  }
  // Hits/results rendering
  renderHits($hits, results);
  renderFacets($facets, results);
  renderDisjunctiveFacets($disjunctiveFacets, results);
  // renderCurrentRefinements($inputfield, $currentRefinements, results);
}

function renderHits($hits, results) {
  // Scan all hits and display them
  var hits = results.hits.map(function renderHit(hit, index) {
    // We rely on the highlighted attributes to know which attribute to display
    // This way our end-user will know where the results come from
    // This is configured in our index settings
    var highlighted = hit._highlightResult;
    var temp = '<li><a class="title" href=' + hit.url + '>' + highlighted.title.value + '</a>'
    temp = temp + '<div class="subject"><p>' + highlighted.summary.value +
      '</p></div><div class="col col-2"><div class="date">' + timetrans(hit.date) + '</div></div></li>'
    return temp;
  });
  $hits.html(hits);
}

function renderFacets($facets, results) {
  var facets = results.facets.map(function (facet) {
    var name = facet.name;
    var header = '<li class="title">' + name + '<span class="icon">+</span></li>';
    var facetValues = results.getFacetValues(name);
    var facetsValuesList = $.map(facetValues, function (facetValue) {
      var facetValueClass = facetValue.isRefined ? 'active' : '';
      var valueAndCount = '<a data-attribute="' + name + '" data-value="' + facetValue.name + '" href="#">' + facetValue.name + ' (' + facetValue.count + ')' + '</a>';
      return '<li class="' + facetValueClass + '">' + valueAndCount + '</li>';
    })
    return '<div class="separator"></div><div class="menu-segment"><ul class="labels">' + header + facetsValuesList.join('') + '</ul></div>';
  });
  $facets.html(facets.join(''));
}

function renderDisjunctiveFacets($disjunctiveFacets, results) {
  var disjunctiveFacets = results.disjunctiveFacets.map(function (facet) {
    var name = facet.name;
    var header = '<li class="title">' + name + '<span class="icon">+</span></li>';
    var facetValues = results.getFacetValues(name);
    var facetsValuesList = $.map(facetValues, function (facetValue) {
      var facetValueClass = facetValue.isRefined ? 'active' : '';
      var valueAndCount = '<a data-attribute="' + name + '" data-value="' + facetValue.name + '" href="#">' + facetValue.name + ' (' + facetValue.count + ')' + '</a>';
      return '<li class="' + facetValueClass + '">' + valueAndCount + '</li>';
    })
    return '<div class="separator"></div><div class="menu-segment"><ul class="labels">' + header + facetsValuesList.join('') + '</ul></div>';
  });
  $disjunctiveFacets.html(disjunctiveFacets.join(''));
}

function renderCurrentRefinements($currentRefinements, results) {
  var currentRefinements = results.getRefinements().map(function (refinement) {
    var name = refinement.name;
    var attributeName = refinement.attributeName
    if(attributeName == "category"){
      faName = 'folder'
    }
    if (attributeName == "tags") {
      faName = 'tag'
    }
    temp = '<a class="refine" data-attribute="' + attributeName + '" data-value="' + name + 
      '" href="#"><i class="fa fa-' + faName + ' fa-xs fa-fw"></i>' + name + ' <i class="fa fa-xs fa-times"></i></a>';
    return temp
  });
  clearRefinements = '<a class="clearRefinements" href="#">' + 
    '<i class="fa fa-times-circle"  data-attribute="all" data-value="all"></i></a>';
  if ($inputfield.val().length > 0 || currentRefinements.length > 0) currentRefinements.push(clearRefinements);
  $currentRefinements.html(currentRefinements.join(''));
}

function handleFacetClick(e) {
  e.preventDefault();
  var target = e.target;
  var attribute = target.dataset.attribute;
  var value = target.dataset.value;
  // console.log(target);
  // Because we are listening in the parent, the user might click where there is no data
  if (!attribute || !value) return;
  // The toggleRefine method works for disjunctive facets as well
  if (attribute == "all" && value == "all"){
    helper.setQuery().clearRefinements().search();
    document.getElementById("searchBox").value = ""
  }else{
    helper.toggleRefine(attribute, value).search();
  }
}

function timetrans(date) {
  var date = new Date(date * 1000);//如果date为13位不需要乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
  var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
  var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
  // return Y + M + D + h + m + s;
  return Y + M + D;
}
