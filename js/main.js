/** Author Pham Khien ***/
jQuery('document').ready(function ($j) {
  // If user in Back-End then return. Function only use in Front-End
  if ($j('body.wp-admin').length > 0) {
    return;
  }
  var commentForm = $j('#commentform'); // Find the comment form

  var submitButton = $j('#commentform #submit');
  var imgLoading = ajaxCommentImgUrl + "loading.gif";
  submitButton.after('<img src="' + imgLoading + '" class="loading-comment" alt="Loading" style="display: none" />');
  var imgLoading = $j('.loading-comment');

  /*--------------------------------------------------------------------------
   Because theme
   Twenty Fourteen,
   Twenty Ten,
   Twenty Fifteen,
   Twenty Twelve,
   Twenty Eleven,
   Twenty Thirteen,
   have different class name or id name
   --------------------------------------------------------------------------*/
  function getElementCommentsTitle() {
    var isCheck = $j('body').find("#comments .comments-title").length;
    if (isCheck > 0) {
      return ".comments-title";
    } else {
      return "#comments-title"
    }
  }

  function getElementCommentsList() {
    var isCheck = $j('body').find("#comments .comment-list").length;
    if (isCheck > 0) {
      return ".comment-list";
    } else {
      return ".commentlist"
    }
  }

  function getElementCommentNavigation(above) {
    var isCheck = $j('body').find("#comments .navigation").length;
    if (isCheck > 0) {
      return ".navigation";
    } else {
      if (above) {
        return "#comment-nav-above"
      } else {
        return "#comment-nav-below"
      }

    }
  }

  var elementCommentsTitle = getElementCommentsTitle();
  var elementCommentsList = getElementCommentsList();
  var elementCommentNavigationAbove = getElementCommentNavigation(true);
  var elementCommentNavigationBelow = getElementCommentNavigation(false);
  /*--------------------------------------------------------------------------
   End - Get element Title, List, Navigation for different theme
   --------------------------------------------------------------------------*/

  $j("body").on("click", '#comments #respond #submit', function () {
    /* Check validation of form with html5 */
    if (!$j("form")[0].checkValidity()) {
      return;
    }
    /**
     * When customer submit comment successfully then system (php code) will redirect to new url
     * Get this url redirect after call ajax. Get param anchor for scroll
     */
    var xhr;
    var _orgAjax = jQuery.ajaxSettings.xhr;
    jQuery.ajaxSettings.xhr = function () {
      xhr = _orgAjax();
      return xhr;
    };


    var formData = commentForm.serialize(); // Serialize and store form data to formData
    var formUrl = commentForm.attr('action'); // Store url action of form to formUrl

    submitButton.hide();
    imgLoading.show();

    // Ajax submit form to action
    $j.ajax({
      url: formUrl,
      data: formData,
      type: 'POST',

      error: function (XMLHttpRequest) {
        if (XMLHttpRequest.status == 429) {
          swal("Error!", "You are posting too quickly!", "error");
        } else if (XMLHttpRequest.status == 409) {
          swal("Error!", "Duplicate comment!", "error");
        } else {
          swal("Error!", "There was an error, please try again!", "error");
        }
      },

      success: function (data, textStatus) {

        var commentList = $j(elementCommentsList, data);
        var commentTitle = $j(elementCommentsTitle, data);
        var navigationAbove = $j('#comments >' + elementCommentNavigationAbove, data).first();
        if (elementCommentNavigationAbove == elementCommentNavigationBelow) {
          // Theme Twenty Thirteen has only navigation below
          var navigationBelow = $j('#comments >' + elementCommentNavigationBelow, data).eq(1);
          if (navigationBelow.length <= 0) {
            var navigationBelow = $j('#comments >' + elementCommentNavigationBelow, data).first();
          }
        } else {
          var navigationBelow = $j('#comments >' + elementCommentNavigationBelow, data).first();
        }

        // When some required fields don't have value
        if (commentTitle.length <= 0) {
          swal("Error!", "Please fill the required fields or incorrect email!", "error");
          return;
        }

        /* When customer reply comment */
        if ($j('#comments > #respond').length <= 0 || $j(elementCommentsTitle).length <= 0) {
          $j('#cancel-comment-reply-link').hide();
          $j('#comment_parent').attr('value', 0);
          var formRespond = $j('#respond');
        }

        /* Reset content of comment */
        $j('#comment').val('');
        if (typeof(formRespond) != "undefined" && formRespond !== null) {
          $j(formRespond).find('#comment').val('');
        }

        /* Reload comment-title, navigation, comment-list */
        if ($j(elementCommentsTitle).length > 0) {
          $j(elementCommentsTitle).replaceWith(commentTitle);
        } else {
          $j('#comments').append(commentTitle);
        }

        if ($j('#comments >' + elementCommentNavigationAbove).length > 0) {
          $j('#comments >' + elementCommentNavigationAbove).replaceWith(navigationAbove);
        } else {
          $j('#comments' + elementCommentsTitle).after(navigationAbove);
        }

        if ($j(elementCommentsList).length > 0) {
          $j(elementCommentsList).replaceWith(commentList);
        } else {
          $j('#comments').append(commentList);
        }

        if ($j('#comments >' + elementCommentNavigationBelow).length > 0) {
          $j('#comments >' + elementCommentNavigationBelow).replaceWith(navigationBelow);
        } else {
          $j('#comments' + elementCommentsList).after(navigationBelow);
        }

        /* Append form comment */
        if (typeof(formRespond) != "undefined" && formRespond !== null) {
          $j('#comments').append(formRespond);
        }

        if (textStatus == "success")
          swal("Success!", "Thanks for your comment. We appreciate your response!", "success");
        else
          swal("Error!", "Please wait a while before posting your next comment!", "error");
      },
      complete: function (jqXHR, textStatus) {
        if (jqXHR.status == 200) {
          var urlRedirect = xhr.responseURL;
          var anchorComment = $j.urlParam('anchor', urlRedirect);
          scrollToCommentAnchor(anchorComment, true);
        } else {
          scrollToCommentAnchor(null, false);
        }

        /* Show - Hide button submit + image */
        submitButton.show();
        imgLoading.hide();

      }

    });
    return false;
  });

  function scrollToCommentAnchor(anchor, $statusComment) {
    if ($statusComment && $j('#' + anchor).length > 0) {
      $j('html, body').animate(
        {scrollTop: $j('#' + anchor).offset().top - 100},
        '500', 'swing');
    } else if ($j("#respond").length > 0) {
      $j('html, body').animate(
        {scrollTop: $j("#respond").offset().top - 100},
        '500', 'swing');
    }

  }

  /**
   * Function get value of param in url
   * @param nameOfParam
   * @param url
   * @returns {*|number}
   */
  $j.urlParam = function (nameOfParam, url) {
    var results = new RegExp('[\?&]' + nameOfParam + '=([^&#]*)').exec(url);
    if (typeof(results) != "undefined" && results !== null) {
      return results[1];
    } else {
      return null;
    }
  };

});
