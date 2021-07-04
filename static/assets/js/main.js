	/*
        Phantom by Pixelarity
        pixelarity.com | hello@pixelarity.com
        License: pixelarity.com/license
    */

(function($) {

	var $window = $(window);
	var $body = $('body');
	var $modal = $('#myModal');

	// Breakpoints.
	breakpoints({
		xlarge: ['1281px', '1680px'],
		large: ['981px', '1280px'],
		medium: ['737px', '980px'],
		small: ['481px', '736px'],
		xsmall: ['361px', '480px'],
		xxsmall: [null, '360px']
	});

	// Play initial animations on page load.
	$window.on('load', function() {
		window.setTimeout(function() {
			$body.removeClass('is-preload');
		}, 100);
	});

	// Touch?
	if (browser.mobile) {
		$body.addClass('is-touch');
	}

	// Forms.
	var $form = $('form');

	// Auto-resizing textareas.
	$form.find('textarea').each(function() {

		var $this = $(this),
			$wrapper = $('<div class="textarea-wrapper"></div>'),
			$submits = $this.find('input[type="submit"]');

		$this
			.wrap($wrapper)
			.attr('rows', 1)
			.css('overflow', 'hidden')
			.css('resize', 'none')
			.on('keydown', function(event) {

				if (event.keyCode == 13
					&& event.ctrlKey) {

					event.preventDefault();
					event.stopPropagation();

					$(this).blur();

				}

			})
			.on('blur focus', function() {
				$this.val($.trim($this.val()));
			})
			.on('input blur focus --init', function() {

				$wrapper
					.css('height', $this.height());

				$this
					.css('height', 'auto')
					.css('height', $this.prop('scrollHeight') + 'px');

			})
			.on('keyup', function(event) {

				if (event.keyCode == 9)
					$this
						.select();

			})
			.triggerHandler('--init');

		// Fix.
		if (browser.name == 'ie'
			|| browser.mobile)
			$this
				.css('max-height', '10em')
				.css('overflow-y', 'auto');

	});

	// Menu.
	var locked = false;

	function lock() {

		if (locked)
			return false;

		locked = true;

		window.setTimeout(function() {
			locked = false;
		}, 350);

		return true;

	}

	function _show() {
		if (lock()) {
			$body.addClass('is-menu-visible');
		}
	}
    /**
     * Loads an image with progress callback.
     *
     * The `onprogress` callback will be called by XMLHttpRequest's onprogress
     * event, and will receive the loading progress ratio as an whole number.
     * However, if it's not possible to compute the progress ratio, `onprogress`
     * will be called only once passing -1 as progress value. This is useful to,
     * for example, change the progress animation to an undefined animation.
     *
     * @param  {string}   imageUrl   The image to load
     * @param  {Function} onprogress
     * @return {Promise}
     */
    function loadImage(imageUrl) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        var notifiedNotComputable = false;

        xhr.open('GET', imageUrl, true);
        xhr.responseType = 'arraybuffer';

        xhr.onloadend = function() {
        if (!xhr.status.toString().match(/^2/)) {
            reject(xhr);
        } else {

            var options = {}
            var headers = xhr.getAllResponseHeaders();
            var m = headers.match(/^Content-Type\:\s*(.*?)$/mi);

            if (m && m[1]) {
            options.type = m[1];
            }

            var blob = new Blob([this.response], options);

            resolve(window.URL.createObjectURL(blob));
        }
        }

        xhr.send();
    });
    }

	function hideModal() {
		$modal.fadeOut( 500, function () {
			$modal.css("display","none");
		});

	}
	function hide() {
		if (lock()) {
			$body.removeClass('is-menu-visible');
		}
	}

	function toggle() {
		if (lock()) {
			$body.toggleClass('is-menu-visible');
		}
	}


	$body
		.on('click', '#menu', function(event) {
			event.stopPropagation();
		})
		.on('click', '#menu a', function(event) {

			var href = $(this).attr('href');

			event.preventDefault();
			event.stopPropagation();

			// Hide.
			hide();

			// Redirect.
			if (href === '#menu') {
				return;
			}

			window.setTimeout(function() {
				window.location.href = href;
			}, 350);

		});

	$body
		.on('click', 'a[href="#menu"]', function(event) {

			event.stopPropagation();
			event.preventDefault();

			toggle();
		})
		.on('click', function(event) {
			hide();
		})
		.on('keydown', function(event) {
			// Hide on escape.
			if (event.keyCode == 27) {
				hide();
				if($modal && $modal.css("display") == "block") {
					hideModal();
				}
			}
		});

        // src: https://stackoverflow.com/questions/41275958/modal-image-galleries-multiple-images
		
    // Get the modal
	if($modal.length) {
		// Get the <span> element that closes the modal
		var titlehover = document.getElementsByClassName("logo")[0];
		var titlething = document.getElementsByClassName("title")[0];
		var titletext = titlething.innerText;

		titlehover.onmouseover = function() {
			let volverText = "VOLVER ...";
			let totalLen = titletext.length-volverText.length;
			if(totalLen < 0) {
				totalLen = 0;
			}
			titlething.innerText = volverText +new Array(parseInt(totalLen/0.5, 10)).join( " " );
		};
		titlehover.onmouseout = function() {
			titlething.innerText = titletext;
		};
        let mql = window.matchMedia('(max-width: 700px)');
        if(mql.matches) {
            return;
        }
        
		//Get the image and insert it inside the modal - use its "alt" text as a caption
		var $img = $('.myImg');
		var $modalImg = $("#img01");
        //var captionText = document.getElementById("caption");
        
		$('.imageBind').on('mouseup', function(event){
			if(event.which != 1) {
				return;
			}
            $modalImg.attr('src', "");

			$modal.css("display","block");
            var newSrc = this.src.split("/");
            var imageUrl = "https://res.cloudinary.com/sgonzalez/image/upload/misabelrodriguez/"+newSrc[newSrc.length-2]+"/"+newSrc[newSrc.length-1];
            var imgContainer = document.getElementById('img01');

            loadImage(imageUrl)
            .then(imgSrc => {
            // Loading successfuly complete; set the image and probably do other stuff.
				imgContainer.src = imgSrc;
            }, xhr => {
            // An error occured. We have the XHR object to see what happened.
            });
            //$modalImg.attr('src', newUrl);
        });

		// When the user clicks on <span> (x), close the modal
		$modal.on('click', function(event) {
            if(event.target != $modalImg)
			    hideModal();
		});
	}

})(jQuery);
