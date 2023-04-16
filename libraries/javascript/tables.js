function tableSearchByCol(id) {
  var input, filter, table, tr, td, i;
  input = document.getElementById('dirSearch');
  filter = input.value.toUpperCase();
  table = document.getElementById('dirTable');
  tr = table.getElementsByTagName('tr');
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName('td')[id];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = '';
      } else {
        tr[i].style.display = 'none';
      }
    }
  }
}

function tableSearchFirstCol(inputId,tableId) {
  var input, filter, table, tr, td, i;
  input = document.getElementById(inputId);
  filter = input.value.toUpperCase();
  table = document.getElementById(tableId);
  tr = table.getElementsByTagName('tr');
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName('td')[0];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = '';
      } else {
        tr[i].style.display = 'none';
      }
    }
  }
}

function fullTableSearch(inputId,tableId,columnId) {
	
	var colId = columnId || "false";
	var input, filter, table, tr, td, i;
	
	input = document.getElementById(inputId);
	filter = input.value.toUpperCase();
	table = document.getElementById(tableId);
	tr = table.getElementsByTagName('tr');
	
	for (i = 0; i < tr.length; i++) {
	
		td = tr[i].getElementsByTagName('td');
		if (td) {
			if (colId !== "false"){
				if (td[colId].innerHTML.toUpperCase().indexOf(filter) > -1) {
					tr[i].style.display = '';
				} else {
					tr[i].style.display = 'none';
				}
			}else{
				for (j = 0; j < td.length; j++){
					if (td[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
						tr[i].style.display = '';
						break;
					} else {
						tr[i].style.display = 'none';
					}
				}
			}
		}
	}
}