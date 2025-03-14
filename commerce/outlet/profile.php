<?php
  include_once('includes/nav.php');
  include_once('includes/user_impression.php');
  include_once('includes/user_info.php');


?>
    <div class="w3-main" style="margin-top:54px">
      <div style="padding:16px 32px">
        <div class="w3-row-padding w3-stretch">
          <div class="w3-col l4">
            <div class="w3-crop w3-round w3-white">
              <div class="w3-crop" style="height:150px">
              <?php
                $coverImagePath = "includes/cover_images/" . htmlspecialchars($outlet_name, ENT_QUOTES, 'UTF-8') . ".png";
                $defaultCover = "includes/cover_images/default_cover.jpg";
                $coverImage = file_exists($coverImagePath) ? $coverImagePath : $defaultCover;
                ?>

                <img src="<?php echo $coverImage; ?>" class="w3-image" alt="Cover Image" style="margin-top:-30px">
              </div>
              <div class="w3-container w3-border-bottom">
                <div class="w3-show-inline-block w3-crop w3-circle" style="border:3px solid #fff; height:75px; width:95px; margin-top:-47px">
                  <img src="includes/logos/<?php echo htmlspecialchars($outlet_name, ENT_QUOTES, 'UTF-8'); ?>.png" class="w3-image" alt="">
                </div>
                <h5 style="margin-top:0; margin-bottom:0;"><?php echo $outlet_name; ?></h5>
                <p  style="margin-top:0; margin-bottom:0;"><?php echo $category; ?></p>
                <p class="w3-text-grey w3-small" style="margin-top:0;">Joined <?php echo $created_at; ?></p>

              </div>
            </div>
          </div>

          <!-- Profile Pane -->
          <div class="w3-col l8">
            <div class="w3-crop w3-round w3-white w3-padding-large">
              <div class="w3-tabs w3-space-around">
                <input id="taba" class="w3-tab-control" type="radio" name="tabs" value="1" checked>
                <label for="taba">
                  <span class="w3-button w3-block w3-border-bottom w3-border-info">
                    <span class="nav-link active"><i class="fa w3-xlarge fa-user"></i> <br> <span>Profile</span></span>
                  </span>
                </label>
                <input id="tabb" class="w3-tab-control" type="radio" name="tabs" value="2">
                <label for="tabb">
                  <span class="w3-button w3-block w3-border-bottom w3-border-info">
                    <span class="nav-link"><i class="fa w3-xlarge fa-envelope-open"></i> <br> <span>Notifications</span></span>
                  </span>
                </label>
                <input id="tabc" class="w3-tab-control" type="radio" name="tabs" value="3">
                <label for="tabc">
                  <span class="w3-button w3-block w3-border-bottom w3-border-info">
                    <span class="nav-link"><i class="fa w3-xlarge fa-edit"></i> <br> <span>Edit</span></span>
                  </span>
                </label>
                <div class="w3-tab-content">
                  <section class="w3-tab-panel w3-padding">
                    <div class="w3-row">
                      <div class="w3-col m6">
                        <div class="w3-flex w3-spaced-items-small">
                          <span class="w3-tag w3-small w3-round w3-purple"><i class="fa fa-user"></i> <?php echo $followers?> Outlet Followers</span>
                          <span class="w3-tag w3-small w3-round w3-success"><i class="fa fa-thumbs-up"></i> <?php echo $likes?> Outlet Likes</span>
                          <span class="w3-tag w3-small w3-round w3-danger"><i class="fa fa-eye"></i> <?php echo $page_visitors?> Outlet Views</span>
                          <span class="w3-tag w3-small w3-round w3-blue"><i class="fa fa-star"></i> <?php echo $reviews?> Outlet Reviews</span>

                        </div>
                      </div>
                    </div>
                    <div>
                      <h5><span class="fa fa-clock-o w3-right"></span> Recent Activity</h5>
                      <div class="table-responsive">
                        <table class="w3-table w3-bordered w3-striped">
                          <tbody>
                            <tr>
                              <td>
                                <strong>You</strong> added a new <strong>Product</strong>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <strong>You</strong> Joined <strong>Jaro</strong>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </section>
                  <section class="w3-tab-panel w3-padding">
                    <div class="w3-display-container w3-margin-bottom w3-info w3-round" role="alert">
                      <button type="button" class="w3-button w3-right w3-padding w3-padding-16 w3-display-right w3-opacity" data-dismiss="alert"><i class="fa fa-times"></i></button>
                      <div class="w3-left w3-padding w3-padding-16">
                        <i class="fa fa-fw fa-info-circle"></i>
                      </div>
                      <div class="w3-padding w3-padding-16">
                        <span><strong>Info!</strong> Lorem Ipsum is simply dummy text.</span>
                      </div>
                    </div>
                    <div class="table-responsive">
                      <table class="w3-table w3-bordered w3-striped">
                        <tbody>
                          <tr>
                            <td>
                              <span class="float-right font-weight-bold">3 hrs ago</span> Here is your a link to the latest summary report from the..
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <span class="float-right font-weight-bold">Yesterday</span> There has been a request on your account since that was..
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <span class="float-right font-weight-bold">9/10</span> Porttitor vitae ultrices quis, dapibus id dolor. Morbi venenatis lacinia rhoncus.
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <span class="float-right font-weight-bold">9/4</span> Vestibulum tincidunt ullamcorper eros eget luctus.
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <span class="float-right font-weight-bold">9/4</span> Maxamillion ais the fix for tibulum tincidunt ullamcorper eros.
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </section>

                <!-- Edit Profile Panel -->
<section class="w3-tab-panel w3-padding">
    <form class="w3-margin-top" id="editProfileForm">
    <div id="messageBox" class="w3-padding w3-round" style="display: none;"></div>
        <h6>Business Details</h6>

        <div class="w3-row w3-margin-bottom">
            <label class="w3-col l3 w3-padding w3-bold w3-uppercase w3-small">Outlet Name</label>
            <div class="w3-col l9">
                <input name="outlet_name" class="w3-input w3-round w3-border" type="text" value="<?php echo $outlet_name; ?>">
            </div>
        </div>

        <div class="w3-row w3-margin-bottom">
            <label class="w3-col l3 w3-padding w3-bold w3-uppercase w3-small">Email</label>
            <div class="w3-col l9">
                <input name="email" class="w3-input w3-round w3-border" type="text" value="<?php echo $email; ?>" readonly>
            </div>
        </div>

        <div class="w3-row w3-margin-bottom">
            <label class="w3-col l3 w3-padding w3-bold w3-uppercase w3-small">WhatsApp Number</label>
            <div class="w3-col l9">
                <input name="whatsapp_no" class="w3-input w3-round w3-border" type="text" value="<?php echo $whatsapp_no; ?>">
            </div>
        </div>

        <div class="w3-row w3-margin-bottom">
            <label class="w3-col l3 w3-padding w3-bold w3-uppercase w3-small">Delivery Locations</label>
            <div class="w3-col l9">
                <input name="location" class="w3-input w3-round w3-border" type="text" value="<?php echo $location; ?>">
            </div>
        </div>

        <div class="w3-row w3-margin-bottom">
            <label class="w3-col l3 w3-padding w3-bold w3-uppercase w3-small">Change Logo</label>
            <div class="w3-col l9">
                <input name="logo" class="w3-input w3-round w3-border" type="file">
            </div>
        </div>

        <div class="w3-row w3-margin-bottom">
            <label class="w3-col l3 w3-padding w3-bold w3-uppercase w3-small">Change Cover Image</label>
            <div class="w3-col l9">
                <input name="cover_image" class="w3-input w3-round w3-border" type="file">
            </div>
        </div>

        <h6>Payment Details</h6>

        <div class="w3-row w3-margin-bottom">
            <label class="w3-col l3 w3-padding w3-bold w3-uppercase w3-small">Account Name</label>
            <div class="w3-col l9">
                <input name="account_name" class="w3-input w3-round w3-border" type="text" value="<?php echo $account_name; ?>">
            </div>
        </div>

        <div class="w3-row w3-margin-bottom">
            <label class="w3-col l3 w3-padding w3-bold w3-uppercase w3-small">Account Number</label>
            <div class="w3-col l9">
                <input name="account_no" class="w3-input w3-round w3-border" type="text" value="<?php echo $account_no; ?>">
            </div>
        </div>

        <div class="w3-row w3-margin-bottom">
            <label class="w3-col l3 w3-padding w3-bold w3-uppercase w3-small">Bank Name</label>
            <div class="w3-col l9">
                <input name="bank_name" class="w3-input w3-round w3-border" type="text" value="<?php echo $bank_name; ?>">
            </div>
        </div>

        <h6>Change Password</h6>

        <div class="w3-row w3-margin-bottom">
            <label class="w3-col l3 w3-padding w3-bold w3-uppercase w3-small">Old Password</label>
            <div class="w3-col l9">
                <input name="old_password" class="w3-input w3-round w3-border" type="password">
            </div>
        </div>

        <div class="w3-row w3-margin-bottom">
            <label class="w3-col l3 w3-padding w3-bold w3-uppercase w3-small">New Password</label>
            <div class="w3-col l9">
                <input name="new_password" class="w3-input w3-round w3-border" type="password">
            </div>
        </div>

        <!-- Button Section -->
        <div class="w3-row w3-margin-bottom">
            <div class="w3-col l3">&nbsp;</div>
            <div class="w3-col l9">
                <input type="reset" class="w3-button w3-round w3-secondary w3-margin-right" value="Cancel">
                <input type="submit" class="w3-button w3-round w3-primary" value="Save Changes" id="saveChanges">
            </div>
        </div>
    </form>
</section>

<!-- JavaScript -->
<script>
$(document).ready(function () {
    $("#editProfileForm").on("submit", function (e) {
        e.preventDefault();

        var formData = new FormData(this);

        $.ajax({
            type: "POST",
            url: "includes/update_profile.php",
            data: formData,
            contentType: false,
            processData: false,
            dataType: "json",
            success: function (response) {
                $("#messageBox").html(response.message).css("display", "block"); 

                if (response.success) {
                    $("#messageBox").css("background", "green").css("color", "white");
                    
                    if (response.logout) {
                        setTimeout(function () {
                            window.location.href = "signin.html"; 
                        }, 3000);
                    } else {
                        setTimeout(function () {
                            location.reload();
                        }, 2000);
                    }
                } else {
                    $("#messageBox").css("background", "red").css("color", "white");
                }
            },
            error: function (xhr, status, error) {
                console.error(xhr.responseText);
                $("#messageBox").html("An error occurred. Please try again.").css("display", "block").css("background", "red").css("color", "white");
            }
        });
    });
});

</script>
</body>
</html>