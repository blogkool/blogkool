   var postTitle = new Array();     // array of posttitles
   var postUrl = new Array();       // array of posturls
   var postDate = new Array();      // array of post publish dates
   var postSum = new Array();       // array of post summaries
   var postLabels = new Array();    // array of post labels

// global variables
   var sortBy = "datenewest";         // default value for sorting kool
   var koolLoaded = false;           // true if feed is read and kool can be displayed
   var numChars = 250;              // number of characters in post summary
   var postFilter = '';             // default filter value
   var kooldiv = document.getElementById("blogkool_sitemap"); //the kool container
   var totalEntires =0; //Entries grabbed till now
   var totalPosts =0; //Total number of posts in the blog.

// main callback function

function loadkool(json) {

   function getPostData() {
   // this functions reads all postdata from the json-feed and stores it in arrays
      if ("entry" in json.feed) {
         var numEntries = json.feed.entry.length;
         totalEntires = totalEntires + numEntries;
         totalPosts=json.feed.openSearch$totalResults.$t
         if(totalPosts>totalEntires)
         {
         var nextjsoncall = document.createElement('script');
         nextjsoncall.type = 'text/javascript';
         startindex=totalEntires+1;
         nextjsoncall.setAttribute("src", "/feeds/posts/summary?start-index=" + startindex + "&max-results=500&alt=json-in-script&callback=loadkool");
         kooldiv.appendChild(nextjsoncall);
         }
      // main loop gets all the entries from the feed
         for (var i = 0; i < numEntries; i++) {
         // get the entry from the feed
            var entry = json.feed.entry[i];

         // get the posttitle from the entry
            var posttitle = entry.title.$t;

         // get the post date from the entry
            var postdate = entry.published.$t.substring(0,10);

         // get the post url from the entry
            var posturl;
            for (var k = 0; k < entry.link.length; k++) {
               if (entry.link[k].rel == 'alternate') {
               posturl = entry.link[k].href;
               break;
               }
            }

         // get the post contents from the entry
         // strip all html-characters, and reduce it to a summary
            if ("content" in entry) {
               var postcontent = entry.content.$t;}
            else
               if ("summary" in entry) {
                  var postcontent = entry.summary.$t;}
               else var postcontent = "";
         // strip off all html-tags
            var re = /<\S[^>]*>/g; 
            postcontent = postcontent.replace(re, "");
         // reduce postcontent to numchar characters, and then cut it off at the last whole word
            if (postcontent.length > numChars) {
               postcontent = postcontent.substring(0,numChars);
               var quoteEnd = postcontent.lastIndexOf(" ");
               postcontent = postcontent.substring(0,quoteEnd) + '...';
            }

         // get the post labels from the entry
            var pll = '';
            if ("category" in entry) {
               for (var k = 0; k < entry.category.length; k++) {
                  pll += '<a href="javascript:filterPosts(\'' + entry.category[k].term + '\');" title="Click here to select all posts with label \'' + entry.category[k].term + '\'">' + entry.category[k].term + '</a>,  ';
               }
            var l = pll.lastIndexOf(',');
            if (l != -1) { pll = pll.substring(0,l); }
            }

         // add the post data to the arrays
            postTitle.push(posttitle);
            postDate.push(postdate);
            postUrl.push(posturl);
            postSum.push(postcontent);
            postLabels.push(pll);
         }
      }
      if(totalEntires==totalPosts) {koolLoaded=true;showkool();}
   } // end of getPostData

// start of showkool function body
// get the number of entries that are in the feed
//   numEntries = json.feed.entry.length;

// get the postdata from the feed
   getPostData();

// sort the arrays
   sortPosts(sortBy);
   koolLoaded = true;
}



// filter and sort functions


function filterPosts(filter) {
// This function changes the filter
// and displays the filtered list of posts
  // document.getElementById("blogkool_sitemap").scrollTop = document.getElementById("blogkool_sitemap").offsetTop;;
   postFilter = filter;
   displaykool(postFilter);
} // end filterPosts

function allPosts() {
// This function resets the filter
// and displays all posts

   postFilter = '';
   displaykool(postFilter);
} // end allPosts

function sortPosts(sortBy) {
// This function is a simple bubble-sort routine
// that sorts the posts

   function swapPosts(x,y) {
   // Swaps 2 kool-entries by swapping all array-elements
      var temp = postTitle[x];
      postTitle[x] = postTitle[y];
      postTitle[y] = temp;
      var temp = postDate[x];
      postDate[x] = postDate[y];
      postDate[y] = temp;
      var temp = postUrl[x];
      postUrl[x] = postUrl[y];
      postUrl[y] = temp;
      var temp = postSum[x];
      postSum[x] = postSum[y];
      postSum[y] = temp;
      var temp = postLabels[x];
      postLabels[x] = postLabels[y];
      postLabels[y] = temp;
   } // end swapPosts

   for (var i=0; i < postTitle.length-1; i++) {
      for (var j=i+1; j<postTitle.length; j++) {
         if (sortBy == "titleasc") { if (postTitle[i] > postTitle[j]) { swapPosts(i,j); } }
         if (sortBy == "titledesc") { if (postTitle[i] < postTitle[j]) { swapPosts(i,j); } }
         if (sortBy == "dateoldest") { if (postDate[i] > postDate[j]) { swapPosts(i,j); } }
         if (sortBy == "datenewest") { if (postDate[i] < postDate[j]) { swapPosts(i,j); } }
      }
   }
} // end sortPosts

// displaying the kool

function displaykool(filter) {
// this function creates a three-column table and adds it to the screen
   var numDisplayed = 0;
   var koolTable = '';
   var koolHead1 = 'POST TITLE';
   var koolTool1 = 'Click to sort by title';
   var koolHead2 = 'POST DATE';
   var koolTool2 = 'Click to sort by date';
   var koolHead3 = 'LABELS';
   var koolTool3 = '';
   if (sortBy == "titleasc") { 
      koolTool1 += ' (descending)';
      koolTool2 += ' (newest first)';
   }
   if (sortBy == "titledesc") { 
      koolTool1 += ' (ascending)';
      koolTool2 += ' (newest first)';
   }
   if (sortBy == "dateoldest") { 
      koolTool1 += ' (ascending)';
      koolTool2 += ' (newest first)';
   }
   if (sortBy == "datenewest") { 
      koolTool1 += ' (ascending)';
      koolTool2 += ' (oldest first)';
   }
   if (postFilter != '') {
      koolTool3 = 'Click to show all posts';
   }
   koolTable += '<table>';
   koolTable += '<tr>';
   koolTable += '<td class="kool-header-col1">';
   koolTable += '<a href="javascript:toggleTitleSort();" title="' + koolTool1 + '">' + koolHead1 + '</a>';
   koolTable += '</td>';
   koolTable += '<td class="kool-header-col2">';
   koolTable += '<a href="javascript:toggleDateSort();" title="' + koolTool2 + '">' + koolHead2 + '</a>';
   koolTable += '</td>';
   koolTable += '<td class="kool-header-col3">';
   koolTable += '<a href="javascript:allPosts();" title="' + koolTool3 + '">' + koolHead3 + '</a>';
   koolTable += '</td>';
   koolTable += '</tr>';
   for (var i = 0; i < postTitle.length; i++) {
      if (filter == '') {
         koolTable += '<tr><td class="kool-entry-col1"><a href="' + postUrl[i] + '" title="' + postSum[i] + '">' + postTitle[i] + '</a></td><td class="kool-entry-col2">' + postDate[i] + '</td><td class="kool-entry-col3">' + postLabels[i] + '</td></tr>';
         numDisplayed++;
      } else {
          z = postLabels[i].lastIndexOf(filter);
          if ( z!= -1) {
             koolTable += '<tr><td class="kool-entry-col1"><a href="' + postUrl[i] + '" title="' + postSum[i] + '">' + postTitle[i] + '</a></td><td class="kool-entry-col2">' + postDate[i] + '</td><td class="kool-entry-col3">' + postLabels[i] + '</td></tr>';
             numDisplayed++;
          }
        }
   }
   koolTable += '</table>';
   if (numDisplayed == postTitle.length) {
      var koolNote = '<span class="kool-note">Displaying all ' + postTitle.length + ' posts<br/></span>'; }
   else {
      var koolNote = '<span class="kool-note">Displaying ' + numDisplayed + ' posts labeled \'';
      koolNote += postFilter + '\' of '+ postTitle.length + ' posts total<br/></span>';
   }
   kooldiv.innerHTML = koolNote + koolTable;
} // end of displaykool

function toggleTitleSort() {
   if (sortBy == "titleasc") { sortBy = "titledesc"; }
   else { sortBy = "titleasc"; }
   sortPosts(sortBy);
   displaykool(postFilter);
} // end toggleTitleSort

function toggleDateSort() {
   if (sortBy == "datenewest") { sortBy = "dateoldest"; }
   else { sortBy = "datenewest"; }
   sortPosts(sortBy);
   displaykool(postFilter);
} // end toggleTitleSort


function showkool() {
  if (koolLoaded) { 
     displaykool(postFilter);
     var koollink = document.getElementById("koollink");
   
  }
  else { alert("Just wait... kool is loading"); }
}

function hidekool() {
  var kooldiv = document.getElementById("kool");
  kooldiv.innerHTML = '';
  var koollink = document.getElementById("koollink");
  koollink.innerHTML = '<a href="#" onclick="scroll(0,0); showkool(); Effect.toggle('+"'kool-result','blind');"+'">» Show Table of Contents</a> <img src="http://chenkaie.blog.googlepages.com/new_1.gif"/>';
}