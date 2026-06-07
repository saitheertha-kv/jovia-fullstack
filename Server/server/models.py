from django.db import models


# -------------------- LOCATION --------------------

class tbl_district(models.Model):
    district_name = models.CharField(max_length=100)


class tbl_place(models.Model):
    place_name = models.CharField(max_length=100)
    district = models.ForeignKey(tbl_district, on_delete=models.CASCADE)


# -------------------- ADMIN --------------------

class tbl_admin(models.Model):
    admin_name = models.CharField(max_length=100)
    admin_email = models.EmailField()
    admin_password = models.CharField(max_length=128)


# -------------------- CATEGORY --------------------

class tbl_category(models.Model):
    category_name = models.CharField(max_length=100)


class tbl_subcategory(models.Model):
    subcategory_name = models.CharField(max_length=100)
    category = models.ForeignKey(tbl_category, on_delete=models.CASCADE)


# -------------------- BRAND --------------------

class tbl_brand(models.Model):
    brand_name = models.CharField(max_length=100)
    brand_email = models.EmailField()
    brand_password = models.CharField(max_length=128)
    brand_photo = models.FileField(upload_to="Assets/brand/photo/")
    brand_proof = models.FileField(upload_to="Assets/brand/proof/")
    brand_link = models.CharField(max_length=1000)
    brand_status = models.IntegerField(default=0)


class tbl_user(models.Model):
    user_name = models.CharField(max_length=100)
    user_email = models.EmailField()
    user_password = models.CharField(max_length=128)
    user_address = models.TextField()
    user_photo = models.FileField(upload_to="Assets/user/photo/")
    user_contact = models.CharField(max_length=20)
    place = models.ForeignKey(tbl_place, on_delete=models.CASCADE,null=True)

# -------------------- INFLUENCER --------------------

class tbl_influencer(models.Model):
    influencer_name = models.CharField(max_length=100)
    influencer_email = models.EmailField()
    influencer_password = models.CharField(max_length=128)
    influencer_status = models.CharField(max_length=50)
    influencer_link = models.CharField(max_length=1000,null=True)
    influencer_photo = models.FileField(upload_to="Assets/influencer/photo/",null=True)
    place = models.ForeignKey(tbl_place, on_delete=models.CASCADE,null=True)




# -------------------- PRODUCT --------------------

class tbl_product(models.Model):
    product_name = models.CharField(max_length=100)
    product_details = models.TextField()
    product_amount = models.DecimalField(max_digits=10, decimal_places=2)
    brand = models.ForeignKey(tbl_brand, on_delete=models.CASCADE)
    subcategory = models.ForeignKey(tbl_subcategory, on_delete=models.CASCADE)


class tbl_product_image(models.Model):
    product = models.ForeignKey(tbl_product, on_delete=models.CASCADE)
    image = models.FileField(upload_to="product/images/")


class tbl_stock(models.Model):
    product = models.ForeignKey(tbl_product, on_delete=models.CASCADE)
    stock_qty = models.IntegerField()


# -------------------- REVIEW --------------------

class tbl_review(models.Model):
    review_count = models.IntegerField()
    review_comment = models.TextField()
    user = models.ForeignKey(tbl_user, on_delete=models.CASCADE)
    product = models.ForeignKey(tbl_product, on_delete=models.CASCADE)


# -------------------- COMPLAINT --------------------

class tbl_complaint(models.Model):
    complaint_title = models.CharField(max_length=200)
    complaint_content = models.TextField()
    complaint_reply = models.TextField(null=True, blank=True)
    user = models.ForeignKey(tbl_user, on_delete=models.CASCADE)


# -------------------- POST (INFLUENCER) --------------------


class tbl_post(models.Model):
    post_description = models.TextField()
    post_file = models.FileField(upload_to="post/files/")
    influencer = models.ForeignKey(tbl_influencer, on_delete=models.CASCADE)
    product = models.ForeignKey(tbl_product, on_delete=models.CASCADE)



class tbl_like(models.Model):
    post = models.ForeignKey(tbl_post, on_delete=models.CASCADE)
    user = models.ForeignKey(tbl_user, on_delete=models.CASCADE)


class tbl_comment(models.Model):
    comment_content = models.TextField()
    user = models.ForeignKey(tbl_user, on_delete=models.CASCADE)
    post = models.ForeignKey(tbl_post, on_delete=models.CASCADE)


class tbl_comment_reply(models.Model):
    reply_content = models.TextField()
    comment = models.ForeignKey(tbl_comment, on_delete=models.CASCADE)
    user = models.ForeignKey(tbl_user, on_delete=models.CASCADE)


# -------------------- LINK --------------------

class tbl_link(models.Model):
    link_url = models.CharField(max_length=200)
    influencer = models.ForeignKey(tbl_influencer, on_delete=models.CASCADE)
# -------------------- REQUEST --------------------

# -------------------- EVENT --------------------

class tbl_event(models.Model):
    event_venue = models.ForeignKey(tbl_place, on_delete=models.CASCADE)
    event_time = models.TimeField()
    event_date = models.DateField()
    event_details = models.TextField()
    event_promocode = models.CharField(max_length=100)
    brand = models.ForeignKey(tbl_brand, on_delete=models.CASCADE)



class tbl_address(models.Model):
    user = models.ForeignKey(tbl_user, on_delete=models.CASCADE)
    address_line = models.TextField()
    pincode = models.CharField(max_length=10)
    created_at = models.DateTimeField(auto_now_add=True)
# -------------------- CART & BOOKING --------------------

class tbl_booking(models.Model):
    booking_date = models.DateField(auto_now_add=True)
    booking_time = models.TimeField()
    booking_amount = models.DecimalField(max_digits=10, decimal_places=2,null=True)
    booking_status = models.IntegerField(default=0)
    user = models.ForeignKey(tbl_user, on_delete=models.CASCADE)
    address = models.ForeignKey(tbl_address, on_delete=models.SET_NULL, null=True, blank=True )


class tbl_cart(models.Model):
    booking = models.ForeignKey(tbl_booking, on_delete=models.CASCADE)
    product = models.ForeignKey(tbl_product, on_delete=models.CASCADE)
    cart_qty = models.IntegerField(default=0)
    cart_price = models.DecimalField(max_digits=10, decimal_places=2,null=True)
    cart_status = models.CharField(max_length=50,default=0)


# -------------------- REPORT --------------------

class tbl_report(models.Model):
    report_content = models.TextField()
    influencer = models.ForeignKey(tbl_influencer, on_delete=models.CASCADE)
    user = models.ForeignKey(tbl_user, on_delete=models.CASCADE)
    post = models.ForeignKey(tbl_post, on_delete=models.CASCADE)


class tbl_chat_room(models.Model):
    brand = models.ForeignKey(tbl_brand, on_delete=models.CASCADE)
    influencer = models.ForeignKey(tbl_influencer, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("brand", "influencer")


class tbl_chat_message(models.Model):
    room = models.ForeignKey(tbl_chat_room, on_delete=models.CASCADE)
    brand = models.ForeignKey(tbl_brand, on_delete=models.CASCADE, null=True, blank=True)
    influencer = models.ForeignKey(tbl_influencer, on_delete=models.CASCADE, null=True, blank=True)
    message = models.TextField(blank=True, null=True)
    sender_type = models.CharField(max_length=20)  # brand / influencer
    message_type = models.CharField(max_length=20, default="text")  # text / request
    created_at = models.DateTimeField(auto_now_add=True)


class tbl_request(models.Model):
    from_brand = models.ForeignKey(
        tbl_brand,
        on_delete=models.CASCADE,
        related_name="sent_requests",
        null=True
    )

    to_influencer = models.ForeignKey(
        tbl_influencer,
        on_delete=models.CASCADE,
        related_name="received_influencer_requests",
        null=True
    )

    request_amount = models.DecimalField(max_digits=10, decimal_places=2)
    product = models.ForeignKey(tbl_product, on_delete=models.CASCADE, null=True)
    request_status = models.CharField(max_length=50, default="0")  # 0 pending, 1 accepted, 2 rejected

    room = models.ForeignKey(tbl_chat_room, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    payment_status = models.CharField(max_length=10, default="0")   # 0 unpaid, 1 paid
    payment_method = models.CharField(max_length=20, blank=True, null=True)
    paid_at = models.DateTimeField(blank=True, null=True)



class tbl_event_apply(models.Model):
    event = models.ForeignKey(tbl_event, on_delete=models.CASCADE)
    influencer = models.ForeignKey(tbl_influencer, on_delete=models.CASCADE)
    apply_status = models.CharField(max_length=50, default="0")  # 0=pending, 1=approved, 2=rejected
    apply_date = models.DateTimeField(auto_now_add=True)



class tbl_complaint(models.Model):
    complaint_title = models.CharField(max_length=50)
    complaint_content = models.CharField(max_length=200)
    complaint_reply = models.CharField(max_length=200, blank=True, default="")
    user = models.ForeignKey(tbl_user, on_delete=models.CASCADE)
    complaint_status = models.CharField(max_length=20, default='pending')