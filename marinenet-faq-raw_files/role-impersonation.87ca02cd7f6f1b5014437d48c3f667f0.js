;(function($) {

	const roleImpersonatingRole = $('#roleImpersonatingRole');
	const isImpersonating = roleImpersonatingRole.length !== 0;

	const impersonateData = {
		switchStyle: isImpersonating ? "display: none;" : "",
		clearStyle: !isImpersonating ? "display: none" : "",
		role: isImpersonating ? roleImpersonatingRole.text().trim() : ""
	}

	function createAnchor() {
		//Find if we have a valid profile dropdown.
		const profileDropdown = $('#tblLoggedIn');

		if(profileDropdown.length === 0)
			return;

		if(impersonateData.role !== '') {
			const displayName = $('#lblAccount');

			const role = $('<span>', { text : impersonateData.role, style: 'color: red; display: block;'});

			role.insertAfter(displayName);
		}

		//Get the LI for the logout button, we'll be adding our element above.
		var logoutLI= $('#cmLogOutBtn').parent('li');

		// Create the roleSwitcher item.
		const roleSwitcherLI = $('<li>')
		const roleSwitcherBtn =
			$('<a>', {id: 'switchRoleHeaderItem', href: "#", class: "d-block text-nowrap"})
			.append($('<span>', { text: 'Switch Role To...', 'data-role-switch': '1', style: impersonateData.switchStyle}))
			.append($('<span>', { text: 'Clear Selected Role', 'data-role-switch': '0', style: impersonateData.clearStyle}))

		const newSpacer = $('<li>').append($('<a>', {class: 'd-block text-nowrap aspNetDisabled'}).append($('<hr>', {class: 'my-0'})))

		roleSwitcherLI.append(roleSwitcherBtn);
		roleSwitcherLI.insertBefore(logoutLI);
		newSpacer.insertAfter(roleSwitcherLI);
	}

	function clearRole() {
		//$('span[data-role-switch="1"]').css('display', 'block');
		//$('span[data-role-switch="0"]').css('display', 'none');


		///*
		$.ajax({
			url: '/bin/portal/roleimpersonation/clear',
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
		//*/
	}

	function switchRole(jsonData) {
		//$('span[data-role-switch="0"]').css('display', 'block');
		//$('span[data-role-switch="1"]').css('display', 'none');
		//$('#rowSwitchCancelBtn').click();

		///*
		$.ajax({
			url: '/bin/portal/roleimpersonation/impersonate',
			type: 'POST',
			data: "data=" + JSON.stringify(jsonData),
			success: function(response) {
				location.reload(true);
				//console.log(response)
			},
			error: function(xhr, status, error) {
				console.log("failed", status, error)
			}
		});
		//*/
	}

	function resetStudentGroup(includeDefault) {
		$('#sgInput').empty(); // Clear the select element
		if(includeDefault) {
			const defaultOption = $('<option>', { value: '', text: 'No Group Selected.' });
			$('#sgInput').append(defaultOption);
		}
	}

	function toggleBonusInfo(button, showBonus, selectId, label) {
		//Toggle Bonus fields.
		$('.bonus-input').css('display', 'none');
		$('.bonus-input').prop('required', false);
		$('#sgInputGroup').css('display', 'none');

		if (showBonus) {
			$('#bonusInfo').css('display', 'block');
			if (selectId) {
				$('#' + selectId).css('display', 'block');
				$('#' + selectId).prop('required', true);
			}

			if ($(button).is('#curriculumCoordinatorBtn')) {
				$('#sgInputGroup').css('display', 'block');
				$('#sgInput').css('display', 'block');
				$('#sgInput').prop('required', true);
			} else {
				//resetStudentGroup(true)
			}
				
			$('#bonusInfoLabel').text(label);
		} else {
			$('#bonusInfo').css('display', 'none');
		}

		// Change the selected item.
		$('.role-impersonate-button').removeClass('btn-primary').addClass('btn-secondary');
		if(button)
			$(button).removeClass('btn-secondary').addClass('btn-primary');
	}
	
	//Ensure whichever fields are visible, have a valid user selection.
	function isValid() {
		const visibleInputs = $('#bonusInfo .bonus-input:visible');

		if (visibleInputs.length === 0) {
			return true; // No input is visible, so validation passes.
		}
	
		let allInputsValid = true;

		visibleInputs.each(function() {
			const inputValue = $(this).val();
			let isValid = true;
			let errorMessage = '';
	
			if ($(this).is('#tmInput')) {
				// tmInput validation: cannot be empty
				isValid = inputValue.trim() !== '';
				errorMessage = 'Training Manager input cannot be empty.';
			} else if ($(this).is('#rcInput')) {
				// rcInput validation: value cannot be < 0
				isValid = parseInt(inputValue, 10) >= 0;
				errorMessage = 'Regional Coordinator select must be a Region.';
			} else if ($(this).is('#cgInput')) {
				// cgInput validation: value cannot be 'na'
				isValid = inputValue !== 'na';
				errorMessage = 'Curriculum Group Director select must be a Curriculum Group.';
			} else if ($(this).is('#sgInput') && $('#curriculumCoordinatorBtn').hasClass('btn-primary')) {
				// sgInput validation: value cannot be ''
                console.log(inputValue);
				isValid = inputValue.length != 0 && !inputValue.includes('');
				errorMessage = 'Curriculum Group Coordinator select must be a Student Group.';
			}
	
			if (!isValid) {
				$(this).get(0).setCustomValidity(errorMessage);
				allInputsValid = false;
			} else {
				$(this).get(0).setCustomValidity('');
			}
		});
	
		return allInputsValid;
	}

	const cgSGCache = {};

	function populateSGInput(group) {
		if (!group.Id)
			return;
		const newOption = $('<option></option>').val(group.Id).text(group.Name);
		$('#sgInput').append(newOption);
	}

	function updateStudentGroups() {
		resetStudentGroup()
		
		const selectedValue = $('#cgInput').val();
        //console.log(selectedValue)
		if(selectedValue === 'na')
			return;

		if(cgSGCache[selectedValue]) {
			data = cgSGCache[selectedValue];
			if(data.length === 0)
				resetStudentGroup(true)
			data.forEach(populateSGInput);
		} else {
			$.ajax({
				url: '/bin/portal/requests/curriculum',
				type: 'GET',
				data: { id: selectedValue},
				success: function(response) {
					if(response === '')
						return;
					data = JSON.parse(response);
					cgSGCache[selectedValue] = data;
					if(data.length === 0)
						resetStudentGroup(true)
					data.forEach(populateSGInput);
					//console.log(response);
				},
				error: function(xhr, status, error) {
					console.log("failed", status, error);
				}
			});
		}
	}

	function removeMyCurriculumGroups() {
		const curriculumGroupOptions = $("#cgInput > option");

		if (curriculumGroupOptions.length === 0)
			return;

		curriculumGroupOptions.each(function () {
			value = $(this).val();
			text = $(this).text();
			//console.log(text, value);
			if((value === 'na' || value === '') && text !== 'All Curriculum Groups' ) {
				this.remove();
			}
				
		});

		updateStudentGroups()
	}

	$(document).on('click', '#switchRoleHeaderItem', function(e) {
		e.preventDefault();
	
		const visibleSpan = $('#switchRoleHeaderItem').find('span[style=""]');
		const roleSwitchValue = visibleSpan.attr('data-role-switch');
		if (roleSwitchValue === "1") {
			// reset the curriculum group:
			removeMyCurriculumGroups();
			// Open the switch role modal
			$('#switchRoleModal').modal('show');
		} else if (roleSwitchValue === "0") {
			const result = confirm(`Are you sure you want to clear the selected role? [Selected Role: ${impersonateData.role}]`);
			if (result) {
				clearRole()
			}
		}
	});

	$(document).on('change', '#cgInput', function () {
		if($('#sgInput').length === 0)
			return;
		
		updateStudentGroups();
	});

	//Add Switch the toggle based on selected button.
	$(document).on('click', '.role-impersonate-button', function() {
		const buttonId = $(this).attr('id');
		switch (buttonId) {
			case 'studentBtn':
				toggleBonusInfo(this, false);
				break;
			case 'trainingManagerBtn':
				toggleBonusInfo(this, true, 'tmInput', 'Enter an Unit Code:');
				break;
			case 'regionalCoordinatorBtn':
				toggleBonusInfo(this, true, 'rcInput', 'Select a Region:');
				break;
			case 'curriculumDirectorBtn':
				toggleBonusInfo(this, true, 'cgInput', 'Select a Curriculum Group:');
				break;
			case 'curriculumCoordinatorBtn':
				toggleBonusInfo(this, true, 'cgInput', 'Select a Curriculum Group:');
				break;
		}
	});

	function resetAllFields() {
		$('.role-impersonate-button').removeClass('btn-primary').addClass('btn-secondary');
	
		// Reset bonus information input fields
		$('input.bonus-input').val('');

		$('select.bonus-input').each(function() {
			const defaultOption = $(this).find('option[data-default="true"]');
			if (defaultOption.length) {
				$(this).val(defaultOption.val());
			} else {
				$(this).prop('selectedIndex', 0);
			}
		});

		resetStudentGroup(true);
	
		// Hide bonus information
		$('#bonusInfo').css('display', 'none');
	}


	// Reset all fields on cancel.
	$(document).on('click', '.rowSwitchCancel', function() {
		resetAllFields();
	});

	$(document).on('hidden.bs.modal', '#switchRoleModal', function() {
		resetAllFields();
	})

	function resetAllFields() {
		$('.role-impersonate-button').removeClass('btn-primary').addClass('btn-secondary');
	
		// Reset bonus information input fields
		$('input.bonus-input').val('');

		$('select.bonus-input').each(function() {
			const defaultOption = $(this).find('option[data-default="true"]');
			if (defaultOption.length) {
				$(this).val(defaultOption.val());
			} else {
				$(this).prop('selectedIndex', 0);
			}
		});

		resetStudentGroup(true);
	
		// Hide bonus information
		$('#bonusInfo').css('display', 'none');
	}

	//Submit the request.
	$(document).on('click', '#rowSwitchSaveBtn', function(e) {
		e.preventDefault()

		if(isValid()) {
			const selectedRoleButton = $('.role-impersonate-button.btn-primary');
			if (selectedRoleButton.length) {
				const roleId = selectedRoleButton.attr('id');
				const jsonData = { roleId };
		
				// Add bonus information if applicable
				if ($('#bonusInfo').css('display') === 'block') {
					if ($('#tmInput').css('display') === 'block') {
						jsonData.tmInput = $('#tmInput').val();
						jsonData.bonusText = "Unit Code: " + $('#tmInput').val();
					}
					if ($('#rcInput').css('display') === 'block') {
						jsonData.rcInput = $('#rcInput').val();
						jsonData.bonusText = "Region: " + $('#rcInput').children(':selected').text();
					}
					if ($('#cgInput').css('display') === 'block') {
						jsonData.cgInput = $('#cgInput').val();
						const text = $('#cgInput').children(':selected').text().replace(/^\W+(.*?)$/,'$1');
						jsonData.bonusText = "Curriculumn Group: " + text;
					}
					if ($('#sgInput').css('display') === 'block') {
						jsonData.sgInput = $('#sgInput').val();
						jsonData.bonusText += " - Student Group: " + $('#sgInput').children(':selected').text();
					}
				}
				
				//console.log(jsonData);
				switchRole(jsonData);
			}
		} else {
			// Trigger the validation message to display
			$('#bonusInfo .bonus-input:visible').each(function () {
                this.reportValidity();
            })
		}
	});


	createAnchor()
	toggleBonusInfo(null, false);
	//removeMyCurriculumGroups();
})($ || $CQ || jQuery);