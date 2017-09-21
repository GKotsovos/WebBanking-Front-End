import React, { PropTypes } from 'react'
import FontAwesome from 'react-fontawesome'
import './Information.css'

export const Information = ({ changePanel }) => (
  <div id="information" className="">
    <FontAwesome id="closeInfoPanel" name="window-close-o" onClick={() => changePanel('NEWS')} />
    <h3 id="infoTittle">ΣΗΜΑΝΤΙΚΕΣ ΠΛΗΡΟΦΟΡΙΕΣ ΑΣΦΑΛΕΙΑΣ</h3>

    <p>H Agile Bank δεν προτίθεται ποτέ να ζητήσει οποιαδήποτε προσωπικά σας στοιχεία μέσω ηλεκτρονικού ταχυδρομείου, pop up windows και banners. Μην αποκαλύπτετε ποτέ μέσω διαδικτύου ή ηλεκτρονικού ταχυδρομείου (email), ή μέσω οποιασδήποτε ηλεκτρονικής συναλλαγής προσωπικά σας στοιχεία όπως Όνομα Χρήστη, Kωδικούς, αριθμούς καρτών, αριθμούς τραπεζικών λογαριασμών κλπ.</p>

    <p>Αν τυχόν παραλάβετε ηλεκτρονικό μήνυμα που σας ζητά να καταχωρήσετε ή να επιβεβαιώσετε προσωπικά στοιχεία που αφορούν την Agile Bank μην το απαντήσετε αφού πρόκειται για απάτη. Παρακαλούμε προωθήστε οποιαδήποτε ύποπτα μηνύματα στο:<br/>
    <a href="">contact@agilebank.gr</a></p>

    <p id="lastPInfo">Αν νομίζετε ότι υπάρχει η πιθανότητα να δώσατε προσωπικά σας στοιχεία με οποιοδήποτε τρόπο, τηλεφωνήστε μας αμέσως στο:<br/>
    14587 ή +302115456981 αν καλείτε από το εξωτερικό<br/></p>

  </div>
)

Information.PropTypes = {
  changePanel: PropTypes.func.isRequired
};

export default Information