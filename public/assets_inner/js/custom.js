/* ------------------------------------------------------------------------------
 *
 *  # Custom JS code
 *
 *  Place here all your custom js. Make sure it's loaded after app.js
 *
 * ---------------------------------------------------------------------------- */
export function datatablesForm () {
    console.log("object");
    $(document).ready(function() {
        var table = $('#example').DataTable({
          processing: true,
          serverSide: true,
          ajax: "/api/customers",  // API endpoint to fetch data
          columns: [
              { data: 'name' ,defaultContent : ""},
              { data: 'father_name' ,defaultContent : ""},
              { data: 'degree' ,defaultContent : ""},
              { data: 'management' ,defaultContent : ""},
              { data: 'document.command_date' ,defaultContent : ""},
              { data: 'purpose' ,defaultContent : ""}
          ],
          dom: 'Bfrtip',  // Add this line to control where the buttons appear
          buttons: [
              'copy', 'excel', 'pdf'
          ]
        });
        
        // Debouncing function for decreaseing server load on every key change
    const debounce = (func, delay) => {
        let debounceTimer;
        return function() {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(this, arguments), delay);
        };
    }

        
            // Apply search on input event
        $('#example thead input').on('keyup change', debounce(function() {
            table
                .column($(this).parent().index())
                .search(this.value)
                .draw();
        },300)); //300ms delay instead of every change packet send to server in every 300ms send one packet
    });
}