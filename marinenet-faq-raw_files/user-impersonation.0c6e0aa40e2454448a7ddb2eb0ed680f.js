;(function($) {

	const userImpersonatingUser = $('#userImpersonatingUser');
	const isImpersonating = userImpersonatingUser.length !== 0;

	const impersonateData = {
		switchStyle: isImpersonating ? "display: none;" : "",
		clearStyle: !isImpersonating ? "display: none" : "",
		user: isImpersonating ? userImpersonatingUser.text().trim() : ""
	}

	function createAnchor() {
		//Find if we have a valid profile dropdown.
		const profileDropdown = $('#tblLoggedIn');

		if(profileDropdown.length === 0)
			return;

		if(impersonateData.user !== '') {
			const displayName = $('#lblAccount');

			const user = $('<span>', { text : impersonateData.user, style: 'color: red; display: block;'});

			user.insertAfter(displayName);
		}

		//Get the LI for the logout button, we'll be adding our element above.
		var logoutLI= $('#cmLogOutBtn').parent('li');

		// Create the userSwitcher item.
		const userSwitcherLI = $('<li>')
		const userSwitcherBtn =
			$('<a>', {id: 'switchUserHeaderItem', href: "#", class: "d-block text-nowrap"})
			.append($('<span>', { text: 'Impersonate User', 'data-user-switch': '1', style: impersonateData.switchStyle}))
			.append($('<span>', { text: 'Stop Impersonation', 'data-user-switch': '0', style: impersonateData.clearStyle}))

		const newSpacer = $('<li>').append($('<a>', {class: 'd-block text-nowrap aspNetDisabled'}).append($('<hr>', {class: 'my-0'})))

		userSwitcherLI.append(userSwitcherBtn);
		userSwitcherLI.insertBefore(logoutLI);
		newSpacer.insertAfter(userSwitcherLI);
	}

	function clearUser() {
		$.ajax({
			url: '/bin/portal/userimpersonation/clear',
			type: 'POST',
			data: {data: ""},
			success: function(response) {
				location.reload(true);
				//console.log(response)
			},
			error: function(xhr, status, error) {
				console.log("failed", status, error)
			}
		});
	}

	function switchUser(jsonData) {
		$('#switchUserModal .impersonate-error').addClass('d-none').text('');
		$.ajax({
			url: '/bin/portal/userimpersonation/impersonate',
			type: 'POST',
			data: "data=" + JSON.stringify(jsonData),
			success: function(response) {
				if (response.impersonated) {
					location.reload(true);
				} else {
					$('#switchUserModal .impersonate-error').removeClass('d-none').text(response.message);
				}
				//console.log(response)
			},
			error: function(xhr, status, error) {
				console.log("failed", status, error)
			}
		});
	}

	//Ensure whichever fields are visible, have a valid user selection.
	function isValid() {

		let allInputsValid = true;

		const inputValue = $('#switchUserModal #txtImpersonateUsername').val();
		let isValid = true;
		let errorMessage = '';

		isValid = inputValue.trim() !== '';
		errorMessage = 'Username input cannot be empty.';

		if (!isValid) {
			$('#switchUserModal #txtImpersonateUsername').get(0).setCustomValidity(errorMessage);
			allInputsValid = false;
		} else {
			$('#switchUserModal #txtImpersonateUsername').get(0).setCustomValidity('');
		}
	
		return allInputsValid;
	}

	$(document).on('click', '#switchUserHeaderItem', function(e) {
		e.preventDefault();

		const visibleSpan = $('#switchUserHeaderItem').find('span[style=""]');
		const userSwitchValue = visibleSpan.attr('data-user-switch');
		if (userSwitchValue === "1") {
			// Open the switch user modal
			$('#switchUserModal').modal('show');
		} else if (userSwitchValue === "0") {
			const result = confirm(`Are you sure you want to stop impersonating ${impersonateData.user}?`);
			if (result) {
				clearUser()
			}
		}
	});

	$(document).on('click', '.user-impersonate-stop-button', function(e) {
		e.preventDefault();

		if (isImpersonating) {
			const result = confirm(`Are you sure you want to stop impersonating ${impersonateData.user}?`);
			if (result) {
				clearUser()
			}
		}
	});

	function resetAllFields() {
		$('#switchUserModal .impersonate-error').addClass('d-none').text('');
		// Reset input fields
		$('#switchUserModal #txtImpersonateUsername').val('');

	}


	// Reset all fields on cancel.
	$(document).on('click', '.rowSwitchCancel', function() {
		resetAllFields();
	});

	$(document).on('hidden.bs.modal', '#switchUserModal', function() {
		resetAllFields();
	})

	//Submit the request.
	$(document).on('click', '#rowSwitchSaveBtn', function(e) {
		e.preventDefault()

		if(isValid()) {
			const userId = $('#switchUserModal #txtImpersonateUsername').val();
			const jsonData = { userId };

			switchUser(jsonData);
		} else {
			// Trigger the validation message to display
			$('#switchUserModal #txtImpersonateUsername').each(function () {
                this.reportValidity();
            })
		}
	});

	$(document).ready(function () {
		$('#switchUserModal #txtImpersonateUsername').keypress(function (e) {
			if (e.keyCode == 13) {
				$('#rowSwitchSaveBtn').click();
				return false;
			}
		});
	});

	createAnchor()
})($ || $CQ || jQuery);