# server/views.py  (drop-in replacement)
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from server.models import *
import json
from django.db.models import F
from datetime import datetime
from django.db.models import Sum
from django.utils import timezone


# ---------- DISTRICT ----------
@csrf_exempt
def District(request):
    data = list(tbl_district.objects.values())
    if request.method == 'POST':
        tbl_district.objects.create(district_name=request.POST['district_name'])
        return JsonResponse({'msg': "Inserted successfully"})
    return JsonResponse({'data': data})



@csrf_exempt
def DeleteDistrict(request, did):
    tbl_district.objects.get(id=did).delete()
    return JsonResponse({'data': list(tbl_district.objects.values())})



@csrf_exempt
def EditDistrict(request, did):
    if request.method == 'PUT':
        
        tbl_district.objects.filter(id=did).update(district_name=json.loads(request.body)['district_name'])
    return JsonResponse({'data': list(tbl_district.objects.values())})



@csrf_exempt
def Category(request):
    if request.method == 'POST':
        tbl_category.objects.create(category_name=request.POST['category_name'])
        return JsonResponse({'msg': "Inserted successfully"})

    data = list(tbl_category.objects.values())
    return JsonResponse({'data': data})


@csrf_exempt
def DeleteCategory(request, did):
    tbl_category.objects.get(id=did).delete()
    return JsonResponse({'data': list(tbl_category.objects.values())})

@csrf_exempt
def EditCategory(request, did):
    if request.method == 'PUT':
        
        tbl_category.objects.filter(id=did).update(category_name=json.loads(request.body)['category_name'])
    return JsonResponse({'data': list(tbl_category.objects.values())})



@csrf_exempt
def Admin(request):
    if request.method == 'POST':
        tbl_admin.objects.create(admin_name=request.POST['admin_name'],admin_email=request.POST['admin_email'],admin_password=request.POST['admin_password'])
        return JsonResponse({'msg': "Inserted successfully"})

    data=list(tbl_admin.objects.values())
    return JsonResponse({'data': data})

@csrf_exempt
def PlaceByDistrict(request, did):
    data = tbl_place.objects.filter(district=did).values("id", "place_name")
    return JsonResponse({"data": list(data)})
# ---------- PLACE ----------
@csrf_exempt
def Place(request):
    if request.method == 'POST':
        tbl_place.objects.create(place_name=request.POST['place_name'],
                                 district_id=request.POST['district_id'])
    qs = tbl_place.objects.values('id','place_name','district_id', district_name=F('district__district_name'))
    return JsonResponse({'data': list(qs)})

@csrf_exempt
def DeletePlace(request, pid):
    tbl_place.objects.get(id=pid).delete()
    qs = tbl_place.objects.values('id','place_name','district_id','district__district_name')
    return JsonResponse({'data': list(qs)})

@csrf_exempt
def EditPlace(request, pid):
    if request.method == 'PUT':
        body = json.loads(request.body)
        tbl_place.objects.filter(id=pid).update(place_name=body['place_name'],
                                                district_id=body['district_id'])
    qs = tbl_place.objects.values('id','place_name','district_id','district__district_name')
    return JsonResponse({'data': list(qs)})


@csrf_exempt
def Subcategory(request):

    if request.method == "POST":
        tbl_subcategory.objects.create(
            subcategory_name=request.POST["subcategory_name"],
            category_id=request.POST["category_id"]
        )

    data = tbl_subcategory.objects.select_related("category")

    result = []
    for s in data:
        result.append({
            "id": s.id,
            "subcategory_name": s.subcategory_name,
            "category_id": s.category.id,
            "category_name": s.category.category_name
        })

    return JsonResponse({"data": result})


@csrf_exempt
def DeleteSubcategory(request, sid):
    tbl_subcategory.objects.filter(id=sid).delete()
    return Subcategory(request)


@csrf_exempt
def EditSubcategory(request, sid):
    if request.method == "PUT":
        body = json.loads(request.body)

        tbl_subcategory.objects.filter(id=sid).update(
            subcategory_name=body["subcategory_name"],
            category_id=body["category_id"]
        )

    return Subcategory(request)


@csrf_exempt
def SubcategoryByCategory(request, cid):

    data = tbl_subcategory.objects.filter(
        category_id=cid
    ).values("id", "subcategory_name")

    return JsonResponse({"data": list(data)})

@csrf_exempt
def BrandReg(request):

    if request.method != "POST":
        return JsonResponse({"error": "Invalid request"}, status=400)

    try:
        tbl_brand.objects.create(
            brand_name=request.POST.get("brand_name"),
            brand_email=request.POST.get("brand_email"),
            brand_password=request.POST.get("brand_password"),
            brand_photo=request.FILES.get("brand_photo"),
            brand_proof=request.FILES.get("brand_proof"),
            brand_link=request.POST.get("brand_link"),
        )

        return JsonResponse({"message": "Brand registered successfully"})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
def PendingBrands(request):

    brands = tbl_brand.objects.filter(brand_status=0)

    data = []
    for b in brands:
        data.append({
            "id": b.id,
            "brand_name": b.brand_name,
            "brand_email": b.brand_email,
            "brand_link": b.brand_link,
            "brand_status": b.brand_status,
            "brand_photo": request.build_absolute_uri(b.brand_photo.url) if b.brand_photo else None,
            "brand_proof": request.build_absolute_uri(b.brand_proof.url) if b.brand_proof else None,
        })

    return JsonResponse({"data": data})
@csrf_exempt
def AcceptedBrands(request):

    brands = tbl_brand.objects.filter(brand_status=1)

    data = []
    for b in brands:
        data.append({
            "id": b.id,
            "brand_name": b.brand_name,
            "brand_email": b.brand_email,
            "brand_link": b.brand_link,
            "brand_status": b.brand_status,
            "brand_photo": request.build_absolute_uri(b.brand_photo.url) if b.brand_photo else None,
            "brand_proof": request.build_absolute_uri(b.brand_proof.url) if b.brand_proof else None,
        })

    return JsonResponse({"data": data})


@csrf_exempt
def RejectedBrands(request):

    brands = tbl_brand.objects.filter(brand_status=2)

    data = []
    for b in brands:
        data.append({
            "id": b.id,
            "brand_name": b.brand_name,
            "brand_email": b.brand_email,
            "brand_link": b.brand_link,
            "brand_status": b.brand_status,
            "brand_photo": request.build_absolute_uri(b.brand_photo.url) if b.brand_photo else None,
            "brand_proof": request.build_absolute_uri(b.brand_proof.url) if b.brand_proof else None,
        })

    return JsonResponse({"data": data})


@csrf_exempt
def AcceptBrand(request, bid):
    tbl_brand.objects.filter(id=bid).update(brand_status=1)
    return JsonResponse({"message": "Brand Accepted"})


@csrf_exempt
def RejectBrand(request, bid):
    tbl_brand.objects.filter(id=bid).update(brand_status=2)
    return JsonResponse({"message": "Brand Rejected"})


@csrf_exempt
def BrandProfile(request, bid):

    try:
        brand = tbl_brand.objects.get(id=bid)

        data = {
            "id": brand.id,
            "brand_name": brand.brand_name,
            "brand_email": brand.brand_email,
            "brand_link": brand.brand_link,
            "brand_status": brand.brand_status,
            "brand_photo": request.build_absolute_uri(brand.brand_photo.url)
                           if brand.brand_photo else None,
            "brand_proof": request.build_absolute_uri(brand.brand_proof.url)
                           if brand.brand_proof else None,
        }

        return JsonResponse({"data": data})

    except tbl_brand.DoesNotExist:
        return JsonResponse({"error": "Brand not found"}, status=404)


@csrf_exempt
def UpdateBrandProfile(request, bid):

    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)

    try:
        brand = tbl_brand.objects.get(id=bid)

        brand.brand_name = request.POST.get("brand_name")
        brand.brand_email = request.POST.get("brand_email")
        brand.brand_link = request.POST.get("brand_link")

        if request.FILES.get("brand_photo"):
            brand.brand_photo = request.FILES.get("brand_photo")

        if request.FILES.get("brand_proof"):
            brand.brand_proof = request.FILES.get("brand_proof")

        brand.save()

        return JsonResponse({"message": "Profile updated successfully"})

    except tbl_brand.DoesNotExist:
        return JsonResponse({"error": "Brand not found"}, status=404)


@csrf_exempt
def ChangeBrandPassword(request, bid):

    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)

    body = json.loads(request.body)

    old_password = body.get("old_password")
    new_password = body.get("new_password")

    try:
        brand = tbl_brand.objects.get(id=bid)

        # verify old password
        if brand.brand_password != old_password:
            return JsonResponse(
                {"message": "Old password is incorrect"},
                status=400
            )

        brand.brand_password = new_password
        brand.save()

        return JsonResponse({"message": "Password changed successfully"})

    except tbl_brand.DoesNotExist:
        return JsonResponse({"error": "Brand not found"}, status=404)


@csrf_exempt
def Userreg(request):

    if request.method != "POST":
        return JsonResponse({"error": "Invalid request"}, status=400)

    try:
        tbl_user.objects.create(
            user_name=request.POST.get("user_name"),
            user_email=request.POST.get("user_email"),
            user_password=request.POST.get("user_password"),
            user_address=request.POST.get("user_address"),
            user_contact=request.POST.get("user_contact"),
            user_photo=request.FILES.get("user_photo"),
            place_id=request.POST.get("place_id"),
        )

        return JsonResponse({"message": "User registered successfully"})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)



# views.py
@csrf_exempt
def UserProfile(request, uid):
    try:
        user = tbl_user.objects.select_related("place__district").get(id=uid)

        data = {
            "id": user.id,
            "user_name": user.user_name,
            "user_email": user.user_email,
            "user_address": user.user_address,
            "user_contact": user.user_contact,
            "user_photo": request.build_absolute_uri(user.user_photo.url) if user.user_photo else "",
            "place_id": user.place.id if user.place else "",
            "place_name": user.place.place_name if user.place else "",
            "district_id": user.place.district.id if user.place and user.place.district else "",
            "district_name": user.place.district.district_name if user.place and user.place.district else "",
        }

        return JsonResponse({"data": data})

    except tbl_user.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)

@csrf_exempt
def UpdateUserProfile(request, uid):

    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)

    try:
        user = tbl_user.objects.get(id=uid)

        user.user_name = request.POST.get("user_name")
        user.user_email = request.POST.get("user_email")
        user.user_address = request.POST.get("user_address")
        user.user_contact = request.POST.get("user_contact")
        user.place_id = request.POST.get("place_id")

        if request.FILES.get("user_photo"):
            user.user_photo = request.FILES.get("user_photo")

        user.save()

        return JsonResponse({"message": "Profile updated successfully"})

    except tbl_user.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)


@csrf_exempt
def ChangeUserPassword(request, uid):

    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)

    body = json.loads(request.body)

    old_password = body.get("old_password")
    new_password = body.get("new_password")

    try:
        user = tbl_user.objects.get(id=uid)

        # Verify old password
        if user.user_password != old_password:
            return JsonResponse(
                {"message": "Old password is incorrect"},
                status=400
            )

        user.user_password = new_password
        user.save()

        return JsonResponse({"message": "Password changed successfully"})

    except tbl_user.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)


@csrf_exempt
def InfluencerReg(request):

    if request.method != "POST":
        return JsonResponse({"error": "Invalid request"}, status=400)

    try:
        tbl_influencer.objects.create(
            influencer_name=request.POST.get("influencer_name"),
            influencer_email=request.POST.get("influencer_email"),
            influencer_password=request.POST.get("influencer_password"),
            influencer_link=request.POST.get("influencer_link"),
            influencer_photo=request.FILES.get("influencer_photo"),
            place_id=request.POST.get("place_id"),
            influencer_status=0   # default pending
        )

        return JsonResponse({"message": "Influencer registered successfully"})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
def InfluencerProfile(request, iid):
    try:
        influencer = tbl_influencer.objects.select_related("place__district").get(id=iid)

        data = {
            "id": influencer.id,
            "influencer_name": influencer.influencer_name,
            "influencer_email": influencer.influencer_email,
            "influencer_link": influencer.influencer_link,
            "influencer_photo": request.build_absolute_uri(influencer.influencer_photo.url)
                                if influencer.influencer_photo else "",
            "place_id": influencer.place.id if influencer.place else "",
            "place_name": influencer.place.place_name if influencer.place else "",
            "district_id": influencer.place.district.id if influencer.place and influencer.place.district else "",
            "district_name": influencer.place.district.district_name if influencer.place and influencer.place.district else ""
        }

        return JsonResponse({"data": data})

    except tbl_influencer.DoesNotExist:
        return JsonResponse({"error": "Influencer not found"}, status=404)

@csrf_exempt
def UpdateInfluencerProfile(request, iid):

    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)

    try:
        influencer = tbl_influencer.objects.get(id=iid)

        influencer.influencer_name = request.POST.get("influencer_name")
        influencer.influencer_email = request.POST.get("influencer_email")
        influencer.influencer_link = request.POST.get("influencer_link")
        influencer.place_id = request.POST.get("place_id")

        if request.FILES.get("influencer_photo"):
            influencer.influencer_photo = request.FILES.get("influencer_photo")

        influencer.save()

        return JsonResponse({"message": "Profile updated successfully"})

    except tbl_influencer.DoesNotExist:
        return JsonResponse({"error": "Influencer not found"}, status=404)

@csrf_exempt
def ChangeInfluencerPassword(request, iid):

    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)

    body = json.loads(request.body)

    old_password = body.get("old_password")
    new_password = body.get("new_password")

    try:
        influencer = tbl_influencer.objects.get(id=iid)

        # Verify old password
        if influencer.influencer_password != old_password:
            return JsonResponse(
                {"message": "Old password is incorrect"},
                status=400
            )

        influencer.influencer_password = new_password
        influencer.save()

        return JsonResponse({"message": "Password changed successfully"})

    except tbl_influencer.DoesNotExist:
        return JsonResponse({"error": "Influencer not found"}, status=404)

@csrf_exempt
def Login(request):

    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)

    body = json.loads(request.body)
    email = body.get("email")
    password = body.get("password")

    # ---------- USER ----------
    user = tbl_user.objects.filter(
        user_email=email,
        user_password=password
    ).first()

    if user:
        return JsonResponse({
            "role": "user",
            "id": user.id,
            "name": user.user_name,
            "message": "Login successful"
        })


    # ---------- INFLUENCER ----------
    influencer = tbl_influencer.objects.filter(
        influencer_email=email,
        influencer_password=password
    ).first()

    if influencer:
        if influencer.influencer_status == 0:
            return JsonResponse({
                "message": "Your account is pending approval"
            }, status=403)

        if influencer.influencer_status == 2:
            return JsonResponse({
                "message": "Your account has been rejected"
            }, status=403)

        return JsonResponse({
            "role": "influencer",
            "id": influencer.id,
            "name": influencer.influencer_name,
            "message": "Login successful"
        })


    # ---------- BRAND ----------
    brand = tbl_brand.objects.filter(
        brand_email=email,
        brand_password=password
    ).first()

    if brand:
        if brand.brand_status == 0:
            return JsonResponse({
                "message": "Your brand is pending approval"
            }, status=403)

        if brand.brand_status == 2:
            return JsonResponse({
                "message": "Your brand has been rejected"
            }, status=403)

        return JsonResponse({
            "role": "brand",
            "id": brand.id,
            "name": brand.brand_name,
            "message": "Login successful"
        })


    # ---------- ADMIN ----------
    admin = tbl_admin.objects.filter(
        admin_email=email,
        admin_password=password
    ).first()

    if admin:
        return JsonResponse({
            "role": "admin",
            "id": admin.id,
            "name": admin.admin_name,
            "message": "Login successful"
        })

    return JsonResponse(
        {"message": "Invalid email or password"},
        status=401
    )


# @csrf_exempt
# def BrandProduct(request, bid):

#     if request.method == "POST":
#         body = json.loads(request.body)

#         tbl_product.objects.create(
#             product_name=body.get("product_name"),
#             product_details=body.get("product_details"),
#             product_amount=body.get("product_amount"),
#             brand_id=bid,
#             subcategory_id=body.get("subcategory_id"),
#         )

#     products = tbl_product.objects.select_related("subcategory") \
#         .filter(brand_id=bid)

#     data = []

#     for p in products:
#         data.append({
#             "id": p.id,
#             "product_name": p.product_name,
#             "product_details": p.product_details,
#             "product_amount": str(p.product_amount),
#             "subcategory_id": p.subcategory.id,
#             "subcategory_name": p.subcategory.subcategory_name
#         })

#     return JsonResponse({"data": data})
@csrf_exempt
def BrandProduct(request, bid):

    if request.method == "POST":
        body = json.loads(request.body)

        tbl_product.objects.create(
            product_name=body.get("product_name"),
            product_details=body.get("product_details"),
            product_amount=body.get("product_amount"),
            brand_id=bid,
            subcategory_id=body.get("subcategory_id"),
        )

    products = tbl_product.objects.select_related(
        "subcategory__category"
    ).filter(brand_id=bid)

    data = []

    for p in products:
        data.append({
            "id": p.id,
            "product_name": p.product_name,
            "product_details": p.product_details,
            "product_amount": str(p.product_amount),

            "subcategory_id": p.subcategory.id,
            "subcategory_name": p.subcategory.subcategory_name,

            "category_id": p.subcategory.category.id,
            "category_name": p.subcategory.category.category_name
        })

    return JsonResponse({"data": data})


@csrf_exempt
def UpdateProduct(request, pid):

    if request.method == "PUT":
        body = json.loads(request.body)

        tbl_product.objects.filter(id=pid).update(
            product_name=body.get("product_name"),
            product_details=body.get("product_details"),
            product_amount=body.get("product_amount"),
            subcategory_id=body.get("subcategory_id"),
        )

    return JsonResponse({"message": "Updated successfully"})


@csrf_exempt
def DeleteProduct(request, pid):

    tbl_product.objects.filter(id=pid).delete()
    return JsonResponse({"message": "Deleted successfully"})


@csrf_exempt
def AllProduct(request):
    products = tbl_product.objects.select_related("subcategory__category", "brand").all()

    data = []

    for p in products:
        first_image = tbl_product_image.objects.filter(product=p).first()

        data.append({
            "id": p.id,
            "product_name": p.product_name,
            "product_details": p.product_details,
            "product_amount": str(p.product_amount),
            "brand_name": p.brand.brand_name,
            "subcategory_id": p.subcategory.id,
            "subcategory_name": p.subcategory.subcategory_name,
            "category_id": p.subcategory.category.id,
            "category_name": p.subcategory.category.category_name,
            "image": first_image.image.url if first_image else ""
        })

    return JsonResponse({"data": data})



@csrf_exempt
def ProductDetails(request, pid):
    try:
        p = tbl_product.objects.select_related("subcategory__category", "brand").get(id=pid)

        images = tbl_product_image.objects.filter(product=p)

        data = {
            "id": p.id,
            "product_name": p.product_name,
            "product_details": p.product_details,
            "product_amount": str(p.product_amount),
            "brand_name": p.brand.brand_name,
            "subcategory_name": p.subcategory.subcategory_name,
            "category_name": p.subcategory.category.category_name,
            "images": [
                request.build_absolute_uri(img.image.url) for img in images if img.image
            ]
        }

        return JsonResponse({"data": data})

    except tbl_product.DoesNotExist:
        return JsonResponse({"error": "Product not found"}, status=404)
    


@csrf_exempt
def AddtoCart(request):
    if request.method == "POST":
        body = json.loads(request.body)
        tbl_booking.object.filter(user=body.get("userid"))

        booking = tbl_booking.objects.create(
           user=tbl_user.objects.get(id=body.get("userid")) ,
           booking_time=datetime.now()
        )
        tbl_cart.objects.create(
            booking=booking,
            product=tbl_product.objects.get(id=body.get("productid"))

        )
            
        return JsonResponse({"status": "success"})

    return JsonResponse({"status": "invalid request"})    


@csrf_exempt
def AddtoCart(request):

    body = json.loads(request.body)

    pid = body.get("productid")
    uid = body.get("userid")

    product = tbl_product.objects.get(id=pid)
    user = tbl_user.objects.get(id=uid)

    # check active booking
    booking = tbl_booking.objects.filter(
        user=user,
        booking_status=0
    ).first()

    if booking:

        cart_exist = tbl_cart.objects.filter(
            booking=booking,
            product=product,
            cart_status=0
        ).first()

        if cart_exist:
            return JsonResponse({"message": "Already added to cart"})

        tbl_cart.objects.create(
            booking=booking,
            product=product,
            cart_qty=1,
            cart_price=product.product_amount,
            cart_status=0
        )

        return JsonResponse({"message": "Added to cart"})

    else:

        booking = tbl_booking.objects.create(
            user=user,
            booking_time=datetime.now().time(),
            booking_amount=0,
            booking_status=0
        )

        tbl_cart.objects.create(
            booking=booking,
            product=product,
            cart_qty=1,
            cart_price=product.product_amount,
            cart_status=0
        )

        return JsonResponse({"message": "Added to cart"})

@csrf_exempt
def ViewCart(request, uid):

    booking = tbl_booking.objects.filter(
        user_id=uid,
        booking_status=0
    ).first()

    if not booking:
        return JsonResponse({"data": [], "total": 0})

    cart = tbl_cart.objects.select_related("product").filter(
        booking=booking,
        cart_status=0
    )

    data = []
    total = 0

    for c in cart:
        subtotal = c.cart_qty * c.cart_price
        total += subtotal

        total_stock = tbl_stock.objects.filter(
            product=c.product
        ).aggregate(
            total=Sum("stock_qty")
        )["total"] or 0

        total_cart_qty = tbl_cart.objects.filter(
            product=c.product,
            cart_status__in=["0", "2"]
        ).aggregate(
            total=Sum("cart_qty")
        )["total"] or 0

        available_stock = total_stock - total_cart_qty
        if available_stock < 0:
            available_stock = 0

        data.append({
            "cart_id": c.id,
            "product_id": c.product.id,
            "product_name": c.product.product_name,
            "price": str(c.cart_price),
            "qty": c.cart_qty,
            "subtotal": str(subtotal),
            "available_stock": available_stock
        })

    return JsonResponse({
        "data": data,
        "total": total
    })


@csrf_exempt
def UpdateCartQty(request):

    body = json.loads(request.body)

    cartid = body.get("cartid")
    qty = body.get("qty")

    cart = tbl_cart.objects.get(id=cartid)
    cart.cart_qty = qty
    cart.save()

    return JsonResponse({"message": "Quantity updated"})


@csrf_exempt
def DeleteCart(request, cid):

    tbl_cart.objects.filter(id=cid).delete()

    return JsonResponse({"message": "Item removed"})

@csrf_exempt
def Checkout(request):

    if request.method == "POST":
        body = json.loads(request.body)

        uid = body.get("uid")
        address_id = body.get("address_id")


        booking = tbl_booking.objects.filter(
            user=uid,
            booking_status=0
        ).first()

        if not booking:
            return JsonResponse({"status": "error", "msg": "No active cart"})

        cart_items = tbl_cart.objects.filter(booking=booking)

        total = 0

        for item in cart_items:
            total += item.product.product_amount * item.cart_qty
        
        booking.address = tbl_address.objects.get(id=address_id)
        booking.booking_amount = total
        booking.booking_status = 1
        booking.save()

        return JsonResponse({
            "status": "success",
            "booking_id": booking.id,
            "amount": total
        })

@csrf_exempt
def PaymentComplete(request):

    if request.method == "POST":
        body = json.loads(request.body)


        booking_id = body.get("booking_id")

        booking = tbl_booking.objects.get(id=booking_id)

        booking.booking_status = 2
        booking.save()

        carts = tbl_cart.objects.filter(booking=booking)

        for c in carts:
            c.cart_status = 2
            c.save()

        return JsonResponse({"status": "success"})


@csrf_exempt
def Post(request):

    if request.method == "POST":

        description = request.POST.get("description")
        file = request.FILES.get("file")
        influencer_id = request.POST.get("influencer")
        product_id = request.POST.get("product")

        influencer = tbl_influencer.objects.get(id=influencer_id)
        product = tbl_product.objects.get(id=product_id)

        tbl_post.objects.create(
            post_description=description,
            post_file=file,
            influencer=influencer,
            product=product
        )

        return JsonResponse({"msg":"Post Added"})

       


@csrf_exempt
def AddLink(request):

    if request.method == "POST":
        print (request.body)
        data = json.loads(request.body)

        url = data.get("url")
        influencerid = data.get("influencerid")

        if not influencerid:
            return JsonResponse({"msg":"Influencer ID missing"})

        try:
            influencer = tbl_influencer.objects.get(id=influencerid)

            tbl_link.objects.create(
                link_url=url,
                influencer=influencer
            )

            return JsonResponse({"msg":"Link Added Successfully"})

        except tbl_influencer.DoesNotExist:
            return JsonResponse({"msg":"Influencer not found"})

            


@csrf_exempt
def addstock(request):
    if request.method == "POST":
        data = json.loads(request.body)

        stockqty = int(data.get("stockqty", 0))
        productid = data.get("productid")

        product = tbl_product.objects.get(id=productid)

        tbl_stock.objects.create(
            product=product,
            stock_qty=stockqty
        )

        total_stock = tbl_stock.objects.filter(
            product=product
        ).aggregate(
            total=Sum("stock_qty")
        )["total"] or 0

        total_cart = tbl_cart.objects.filter(
            product=product,
            cart_status__in=["0", "2"]
        ).aggregate(
            total=Sum("cart_qty")
        )["total"] or 0

        current_stock = total_stock - total_cart
        if current_stock < 0:
            current_stock = 0

        return JsonResponse({
            "message": "Stock Updated Successfully",
            "current_stock": current_stock,
            "total_stock": total_stock,
            "total_cart": total_cart
        })

@csrf_exempt
def ProductStock(request, pid):
    try:
        product = tbl_product.objects.get(id=pid)

        total_stock = tbl_stock.objects.filter(
            product=product
        ).aggregate(
            total=Sum("stock_qty")
        )["total"] or 0

        total_cart = tbl_cart.objects.filter(
            product=product,
            cart_status__in=["0", "2"]
        ).aggregate(
            total=Sum("cart_qty")
        )["total"] or 0

        available_stock = total_stock - total_cart

        if available_stock < 0:
            available_stock = 0

        data = {
            "product_id": product.id,
            "product_name": product.product_name,
            "total_stock": total_stock,
            "total_cart": total_cart,
            "stock_qty": available_stock
        }

        return JsonResponse({"data": data})

    except tbl_product.DoesNotExist:
        return JsonResponse({"message": "Product not found"}, status=404)

@csrf_exempt
def SearchInfluencer(request):

    name = request.GET.get("name", "")

    influencers = tbl_influencer.objects.select_related(
        "place__district"
    ).filter(
        influencer_status=1,
        influencer_name__icontains=name
    )

    data = []

    for i in influencers:

        data.append({
            "id": i.id,
            "influencer_name": i.influencer_name,
            "influencer_email": i.influencer_email,
            "influencer_link": i.influencer_link,
            "influencer_photo": request.build_absolute_uri(i.influencer_photo.url)
                                if i.influencer_photo else None,
            "place_name": i.place.place_name if i.place else None,
            "district_name": i.place.district.district_name if i.place else None
        })

    return JsonResponse({"data": data})



@csrf_exempt
def BrandProducts(request, bid):

    products = tbl_product.objects.filter(brand_id=bid)

    data = list(products.values(
        "id",
        "product_name"
    ))

    return JsonResponse({"data": data})


@csrf_exempt
def AddRequest(request):

    body = json.loads(request.body)

    bid = body.get("brand_id")
    iid = body.get("influencer_id")
    pid = body.get("product_id")
    amount = body.get("amount")

    tbl_request.objects.create(

        from_brand_id=bid,
        to_influencer_id=iid,
        product_id=pid,
        request_amount=amount,
        request_status=0

    )

    return JsonResponse({"message": "Request Sent"})



@csrf_exempt
def BrandRequests(request, bid):

    requests = tbl_request.objects.select_related(
        "to_influencer",
        "product"
    ).filter(from_brand_id=bid)

    data = []

    for r in requests:

        data.append({
            "id": r.id,
            "influencer_name": r.to_influencer.influencer_name,
            "product_name": r.product.product_name if r.product else None,
            "amount": str(r.request_amount),
            "status": r.request_status
        })

    return JsonResponse({"data": data})

@csrf_exempt
def InfluencerRequests(request, iid):

    requests = tbl_request.objects.select_related(
        "from_brand",
        "product"
    ).filter(to_influencer_id=iid)

    data = []

    for r in requests:
        data.append({
            "id": r.id,
            "brand_name": r.from_brand.brand_name if r.from_brand else None,
            "product_id": r.product.id if r.product else None,
            "product_name": r.product.product_name if r.product else None,
            "amount": str(r.request_amount),
            "status": r.request_status
        })

    return JsonResponse({"data": data})

@csrf_exempt
def AcceptRequest(request, rid):
    try:
        req = tbl_request.objects.get(id=rid)
        req.request_status = "1"
        req.save()

        if req.from_brand and req.to_influencer:
            room, created = tbl_chat_room.objects.get_or_create(
                request=req,
                defaults={
                    "brand": req.from_brand,
                    "influencer": req.to_influencer
                }
            )

        return JsonResponse({
            "status": "success",
            "message": "Request accepted"
        })
    except tbl_request.DoesNotExist:
        return JsonResponse({
            "status": "error",
            "message": "Request not found"
        }, status=404)
    except Exception as e:
        return JsonResponse({
            "status": "error",
            "message": str(e)
        }, status=500)
    

@csrf_exempt
def RejectRequest(request, rid):

    tbl_request.objects.filter(id=rid).update(
        request_status=2
    )

    return JsonResponse({
        "message": "Request Rejected"
    })

@csrf_exempt
def InfluencerPosts(request, iid):
    posts = tbl_post.objects.filter(influencer_id=iid).select_related("product")

    data = []

    for post in posts:
        comments = tbl_comment.objects.filter(post=post).select_related("user")

        data.append({
            "id": post.id,
            "product_name": post.product.product_name,
            "description": post.post_description,
            "file": request.build_absolute_uri(post.post_file.url) if post.post_file else "",
            "likes_count": tbl_like.objects.filter(post=post).count(),
            "comments_count": comments.count(),
            "comments": [
                {
                    "id": c.id,
                    "comment": c.comment_content,
                    "user_name": c.user.user_name if c.user else "User"
                }
                for c in comments
            ]
        })

    return JsonResponse({"data": data})

@csrf_exempt
def AllPosts(request):

    posts = tbl_post.objects.select_related(
        "influencer",
        "product"
    ).all()

    data = []

    for p in posts:

        like_count = tbl_like.objects.filter(post=p).count()
        comment_count = tbl_comment.objects.filter(post=p).count()

        data.append({
            "id": p.id,
            "description": p.post_description,
            "file": request.build_absolute_uri(p.post_file.url) if p.post_file else None,
            "product_name": p.product.product_name,
            "product_id": p.product.id,
            "influencer_name": p.influencer.influencer_name,
            "influencer_id": p.influencer.id,
            "likes": like_count,
            "comments": comment_count
        })

    return JsonResponse({"data": data})


@csrf_exempt
def ToggleLike(request):

    body = json.loads(request.body)

    pid = body.get("post_id")
    uid = body.get("user_id")

    like = tbl_like.objects.filter(post_id=pid,user_id=uid).first()

    if like:
        like.delete()
    else:
        tbl_like.objects.create(post_id=pid,user_id=uid)

    count = tbl_like.objects.filter(post_id=pid).count()

    return JsonResponse({
        "likes": count
    })


@csrf_exempt
def AddComment(request):

    body = json.loads(request.body)

    pid = body.get("post_id")

    tbl_comment.objects.create(
        comment_content=body.get("comment"),
        post_id=pid,
        user_id=body.get("user_id")
    )

    count = tbl_comment.objects.filter(post_id=pid).count()

    return JsonResponse({
        "comments": count
    })


@csrf_exempt
def AddReply(request):

    body = json.loads(request.body)

    tbl_comment_reply.objects.create(
        reply_content=body.get("reply"),
        comment_id=body.get("comment_id"),
        user_id=body.get("user_id")
    )

    return JsonResponse({"message": "Reply Added"})


@csrf_exempt
def GetComments(request, pid):

    comments = tbl_comment.objects.filter(
        post_id=pid
    ).select_related("user")

    data = []

    for c in comments:

        replies = tbl_comment_reply.objects.filter(
            comment=c
        ).select_related("user")

        reply_data = []

        for r in replies:
            reply_data.append({
                "reply": r.reply_content,
                "user": r.user.user_name
            })

        data.append({
            "comment_id": c.id,
            "comment": c.comment_content,
            "user": c.user.user_name,
            "user_id": c.user.id,
            "replies": reply_data
        })

    return JsonResponse({"data": data})


    





@csrf_exempt
def AddEvent(request,id):

    if request.method == "POST":

        data = json.loads(request.body)

        tbl_event.objects.create(

            event_venue = tbl_place.objects.get(id=data["venue"]),
            event_time = data["time"],
            event_date = data["date"],
            event_details = data["details"],
            event_promocode = data["promo"],
            brand = tbl_brand.objects.get(id=id)

        )

        return JsonResponse({"msg":"Event Added"})


def BrandEvent(request, id):
    events = tbl_event.objects.select_related("event_venue__district").filter(brand=id)

    data = []

    for e in events:
        data.append({
            "id": e.id,
            "district_name": e.event_venue.district.district_name,
            "place_name": e.event_venue.place_name,
            "event_date": e.event_date,
            "event_time": e.event_time,
            "event_details": e.event_details,
            "event_promocode": e.event_promocode
        })

    return JsonResponse({"data": data})

@csrf_exempt
def AllEvent(request):
    events = tbl_event.objects.select_related("event_venue__district", "brand").all()

    data = []

    for e in events:
        data.append({
            "id": e.id,
            "district_name": e.event_venue.district.district_name,
            "place_name": e.event_venue.place_name,
            "event_date": e.event_date,
            "event_time": e.event_time,
            "event_details": e.event_details,
            "event_promocode": e.event_promocode
        })

    return JsonResponse({"data": data})

@csrf_exempt
def GetAddress(request, uid):

    data = tbl_address.objects.filter(user=uid)

    arr = []

    for i in data:
        arr.append({
            "id": i.id,
            "address": i.address_line,
            "pincode": i.pincode,
           
        })

    return JsonResponse({"data": arr})

@csrf_exempt
def AddAddress(request):

    if request.method == "POST":

        data = json.loads(request.body)

        uid = data.get("uid")

        count = tbl_address.objects.filter(user=uid).count()

        if count >= 3:
            return JsonResponse({
                "status": "error",
                "msg": "Maximum 3 addresses allowed"
            })

        tbl_address.objects.create(
            user=tbl_user.objects.get(id=uid),
            address_line=data.get("address"),
            pincode=data.get("pincode")
        )

        return JsonResponse({"status": "success"})

@csrf_exempt
def DeleteAddress(request, aid):

    address = tbl_address.objects.filter(id=aid).first()

    if not address:
        return JsonResponse({"status":"error","msg":"Address not found"})

    address.delete()

    return JsonResponse({"status": "deleted"})

@csrf_exempt
def MyBookings(request, uid):

    bookings = tbl_booking.objects.filter(
        user=uid,
        booking_status__gte=0
    ).select_related("address").order_by("-id")

    result = []

    for b in bookings:

        carts = tbl_cart.objects.filter(booking=b)

        cart_items = []

        for c in carts:
            first_image = tbl_product_image.objects.filter(product=c.product).first()

            cart_items.append({
                "cart_id": c.id,
                "product_id": c.product.id,
                "product_name": c.product.product_name,
                "description": c.product.product_details,
                "price": str(c.product.product_amount),
                "photo": request.build_absolute_uri(first_image.image.url) if first_image and first_image.image else "",
                "qty": c.cart_qty,
                "subtotal": str(c.cart_qty * c.product.product_amount),
                "cart_status": str(c.cart_status)
            })

        result.append({
            "booking_id": b.id,
            "date": b.booking_date,
            "amount": str(b.booking_amount) if b.booking_amount else "0.00",
            "booking_status": int(b.booking_status),

            "address_line": b.address.address_line if b.address else "No address selected",
            "pincode": b.address.pincode if b.address else "",

            "items": cart_items
        })

    return JsonResponse({"data": result})

@csrf_exempt
def BrandPosts(request, bid):

    posts = tbl_post.objects.filter(product__brand=bid)

    data = []

    for post in posts:
        data.append({
            "id": post.id,
            "description": post.post_description,
            "file": post.post_file.url if post.post_file else "",
            "product_name": post.product.product_name,
            "likes_count": tbl_like.objects.filter(post=post).count(),
            "comments_count": tbl_comment.objects.filter(post=post).count(),
        })

    return JsonResponse({
        "data": data
    })

@csrf_exempt
def AddProductImage(request):
    if request.method == "POST":
        product_id = request.POST.get("product_id")

        if not product_id:
            return JsonResponse({"message": "Product ID required"}, status=400)

        if "image" not in request.FILES:
            return JsonResponse({"message": "Image required"}, status=400)

        tbl_product_image.objects.create(
            product_id=product_id,
            image=request.FILES["image"]
        )

        return JsonResponse({"message": "Image uploaded"})


def ProductImages(request, pid):
    images = tbl_product_image.objects.filter(product_id=pid)

    data = []

    for img in images:
        data.append({
            "id": img.id,
            "image": request.build_absolute_uri(img.image.url)
        })

    return JsonResponse({"data": data})


@csrf_exempt
def DeleteProductImage(request, id):
    try:
        img = tbl_product_image.objects.get(id=id)
        img.delete()
        return JsonResponse({"message": "Image deleted"})
    except:
        return JsonResponse({"message": "Image not found"}, status=404)
    

@csrf_exempt
def BrandBookings(request, bid):

    bookings = tbl_booking.objects.filter(
        tbl_cart__product__brand_id=bid
    ).select_related(
        "user",
        "address"
    ).distinct().order_by("-id")

    result = []

    for b in bookings:
        brand_items = tbl_cart.objects.filter(
            booking=b,
            product__brand_id=bid
        ).select_related("product")

        items = []

        for c in brand_items:
            first_image = tbl_product_image.objects.filter(product=c.product).first()

            items.append({
                "cart_id": c.id,
                "product_id": c.product.id,
                "product_name": c.product.product_name,
                "product_details": c.product.product_details,
                "product_amount": str(c.product.product_amount),
                "product_image": request.build_absolute_uri(first_image.image.url)
                                 if first_image and first_image.image else "",
                "cart_qty": c.cart_qty,
                "cart_status": str(c.cart_status),
                "subtotal": str(c.cart_qty * c.product.product_amount)
            })

        result.append({
            "booking_id": b.id,
            "booking_date": b.booking_date,
            "booking_amount": str(b.booking_amount) if b.booking_amount else "0.00",
            "booking_status": int(b.booking_status),
            "customer_name": b.user.user_name if b.user else "",
            "customer_contact": b.user.user_contact if b.user else "",
            "address_id": b.address.id if b.address else "",
            "address_line": b.address.address_line if b.address else "No address selected",
            "pincode": b.address.pincode if b.address else "",
            "items": items
        })

    return JsonResponse({"data": result})

@csrf_exempt
def UpdateBrandCartStatus(request, cid, status):
    try:
        cart = tbl_cart.objects.get(id=cid)

        cart.cart_status = str(status)
        cart.save()

        booking = cart.booking

        total_items = tbl_cart.objects.filter(booking=booking).count()
        delivered_items = tbl_cart.objects.filter(
            booking=booking,
            cart_status="6"
        ).count()

        if total_items == delivered_items and total_items > 0:
            booking.booking_status = 3
            booking.save()

        return JsonResponse({
            "message": "Cart status updated successfully"
        })

    except tbl_cart.DoesNotExist:
        return JsonResponse({
            "message": "Cart item not found"
        }, status=404)
    


@csrf_exempt
def PendingInfluencers(request):
    influencers = tbl_influencer.objects.filter(influencer_status=0).select_related("place__district")

    data = []
    for i in influencers:
        data.append({
            "id": i.id,
            "influencer_name": i.influencer_name,
            "influencer_email": i.influencer_email,
            "influencer_link": i.influencer_link,
            "influencer_status": i.influencer_status,
            "influencer_photo": request.build_absolute_uri(i.influencer_photo.url) if i.influencer_photo else None,
            "place_name": i.place.place_name if i.place else None,
            "district_name": i.place.district.district_name if i.place and i.place.district else None,
        })

    return JsonResponse({"data": data})


@csrf_exempt
def AcceptedInfluencers(request):
    influencers = tbl_influencer.objects.filter(influencer_status=1).select_related("place__district")

    data = []
    for i in influencers:
        data.append({
            "id": i.id,
            "influencer_name": i.influencer_name,
            "influencer_email": i.influencer_email,
            "influencer_link": i.influencer_link,
            "influencer_status": i.influencer_status,
            "influencer_photo": request.build_absolute_uri(i.influencer_photo.url) if i.influencer_photo else None,
            "place_name": i.place.place_name if i.place else None,
            "district_name": i.place.district.district_name if i.place and i.place.district else None,
        })

    return JsonResponse({"data": data})


@csrf_exempt
def RejectedInfluencers(request):
    influencers = tbl_influencer.objects.filter(influencer_status=2).select_related("place__district")

    data = []
    for i in influencers:
        data.append({
            "id": i.id,
            "influencer_name": i.influencer_name,
            "influencer_email": i.influencer_email,
            "influencer_link": i.influencer_link,
            "influencer_status": i.influencer_status,
            "influencer_photo": request.build_absolute_uri(i.influencer_photo.url) if i.influencer_photo else None,
            "place_name": i.place.place_name if i.place else None,
            "district_name": i.place.district.district_name if i.place and i.place.district else None,
        })

    return JsonResponse({"data": data})


@csrf_exempt
def AcceptInfluencer(request, iid):
    tbl_influencer.objects.filter(id=iid).update(influencer_status=1)
    return JsonResponse({"message": "Influencer Accepted"})


@csrf_exempt
def RejectInfluencer(request, iid):
    tbl_influencer.objects.filter(id=iid).update(influencer_status=2)
    return JsonResponse({"message": "Influencer Rejected"})



@csrf_exempt
def DeleteComment(request, cid):
    if request.method == "DELETE":
        try:
            comment = tbl_comment.objects.get(id=cid)

            data = json.loads(request.body)
            user_id = data.get("user_id")

            # 🔐 allow only owner to delete
            if str(comment.user.id) != str(user_id):
                return JsonResponse({
                    "status": "error",
                    "message": "Unauthorized"
                }, status=403)

            comment.delete()

            return JsonResponse({
                "status": "success",
                "message": "Comment deleted"
            })

        except tbl_comment.DoesNotExist:
            return JsonResponse({
                "status": "error",
                "message": "Comment not found"
            }, status=404)
        

@csrf_exempt
def UserInfluencerPosts(request, iid):
    try:
        posts = tbl_post.objects.filter(influencer_id=iid).select_related("product", "influencer")

        data = []

        for post in posts:
            comments = tbl_comment.objects.filter(post=post).select_related("user")

            data.append({
                "id": post.id,
                "product_id": post.product.id if post.product else None,
                "product_name": post.product.product_name if post.product else "",
                "description": post.post_description,
                "file": request.build_absolute_uri(post.post_file.url) if post.post_file else "",
                "likes": tbl_like.objects.filter(post=post).count(),
                "comments": comments.count(),
                "comments_list": [
                    {
                        "id": c.id,
                        "comment": c.comment_content,
                        "user_name": c.user.user_name if c.user else "User"
                    }
                    for c in comments
                ]
            })

        return JsonResponse({
            "status": "success",
            "data": data
        })

    except Exception as e:
        return JsonResponse({
            "status": "error",
            "message": str(e)
        }, status=500)
    


@csrf_exempt
def UserInfluencerProfile(request, iid):
    try:
        influencer = tbl_influencer.objects.select_related("place").get(id=iid)

        data = {
            "id": influencer.id,
            "name": influencer.influencer_name,
            "photo": request.build_absolute_uri(influencer.influencer_photo.url) if influencer.influencer_photo else "",
            "link": influencer.influencer_link,
            "place": influencer.place.place_name if influencer.place else "",
        }

        return JsonResponse({
            "status": "success",
            "data": data
        })

    except tbl_influencer.DoesNotExist:
        return JsonResponse({
            "status": "error",
            "message": "Influencer not found"
        }, status=404)
    


@csrf_exempt
def MyBrandRequests(request, bid):
    try:
        requests = tbl_request.objects.filter(from_brand_id=bid).select_related(
            "to_influencer", "product"
        ).order_by("-id")

        data = []
        for r in requests:
            data.append({
                "id": r.id,
                "influencer_id": r.to_influencer.id if r.to_influencer else None,
                "influencer_name": r.to_influencer.influencer_name if r.to_influencer else "",
                "product_id": r.product.id if r.product else None,
                "product_name": r.product.product_name if r.product else "",
                "amount": str(r.request_amount),
                "status": int(r.request_status) if str(r.request_status).isdigit() else r.request_status,
            })

        return JsonResponse({
            "status": "success",
            "data": data
        })
    except Exception as e:
        return JsonResponse({
            "status": "error",
            "message": str(e)
        }, status=500)
    

    
@csrf_exempt
def GetOrCreateChatRoom(request):
    if request.method != "POST":
        return JsonResponse({"status": "error", "message": "Invalid request"}, status=405)

    try:
        body = json.loads(request.body)
        brand_id = body.get("brand_id")
        influencer_id = body.get("influencer_id")

        if not brand_id or not influencer_id:
            return JsonResponse({"status": "error", "message": "brand_id and influencer_id required"}, status=400)

        brand = tbl_brand.objects.get(id=brand_id)
        influencer = tbl_influencer.objects.get(id=influencer_id)

        room, created = tbl_chat_room.objects.get_or_create(
            brand=brand,
            influencer=influencer
        )

        return JsonResponse({
            "status": "success",
            "room_id": room.id,
            "brand_id": brand.id,
            "influencer_id": influencer.id
        })

    except tbl_brand.DoesNotExist:
        return JsonResponse({"status": "error", "message": "Brand not found"}, status=404)
    except tbl_influencer.DoesNotExist:
        return JsonResponse({"status": "error", "message": "Influencer not found"}, status=404)
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)
    

@csrf_exempt
def ViewRoomMessages(request, room_id):
    try:
        room = tbl_chat_room.objects.select_related("brand", "influencer").get(id=room_id)
        messages = tbl_chat_message.objects.filter(room=room).order_by("created_at")
        requests = tbl_request.objects.filter(room=room).select_related("product", "from_brand", "to_influencer")

        data = []

        for msg in messages:
            sender_name = ""
            if msg.sender_type == "brand" and msg.brand:
                sender_name = msg.brand.brand_name
            elif msg.sender_type == "influencer" and msg.influencer:
                sender_name = msg.influencer.influencer_name

            data.append({
                "id": f"msg_{msg.id}",
                "type": "message",
                "message_type": msg.message_type,
                "message": msg.message,
                "sender_type": msg.sender_type,
                "sender_name": sender_name,
                "created_at": msg.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            })

        for req in requests:
            data.append({
                "id": f"req_{req.id}",
                "type": "request",
                "request_id": req.id,
                "product_id": req.product.id if req.product else None,
                "product_name": req.product.product_name if req.product else "",
                "amount": str(req.request_amount),
                "status": req.request_status,
                "sender_type": "brand",
                "sender_name": req.from_brand.brand_name if req.from_brand else "",
                "created_at": req.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            })

        data = sorted(data, key=lambda x: x["created_at"])

        return JsonResponse({
            "status": "success",
            "room_id": room.id,
            "data": data
        })

    except tbl_chat_room.DoesNotExist:
        return JsonResponse({"status": "error", "message": "Room not found"}, status=404)
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)
    

@csrf_exempt
def SendRoomMessage(request):
    if request.method != "POST":
        return JsonResponse({"status": "error", "message": "Invalid request"}, status=405)

    try:
        body = json.loads(request.body)
        room_id = body.get("room_id")
        sender_type = body.get("sender_type")
        sender_id = body.get("sender_id")
        message = body.get("message")

        if not room_id or not sender_type or not sender_id or not message:
            return JsonResponse({"status": "error", "message": "Missing required fields"}, status=400)

        room = tbl_chat_room.objects.get(id=room_id)

        chat_data = {
            "room": room,
            "message": message,
            "sender_type": sender_type,
            "message_type": "text"
        }

        if sender_type == "brand":
            chat_data["brand"] = tbl_brand.objects.get(id=sender_id)
        elif sender_type == "influencer":
            chat_data["influencer"] = tbl_influencer.objects.get(id=sender_id)
        else:
            return JsonResponse({"status": "error", "message": "Invalid sender type"}, status=400)

        msg = tbl_chat_message.objects.create(**chat_data)

        return JsonResponse({"status": "success", "id": msg.id})

    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)
    
@csrf_exempt
def SendRequestInChat(request):
    if request.method != "POST":
        return JsonResponse({"status": "error", "message": "Invalid request"}, status=405)

    try:
        body = json.loads(request.body.decode("utf-8"))

        room_id = body.get("room_id")
        brand_id = body.get("brand_id")
        influencer_id = body.get("influencer_id")
        product_id = body.get("product_id")
        amount = body.get("amount")

        if not all([room_id, brand_id, influencer_id, product_id, amount]):
            return JsonResponse(
                {"status": "error", "message": "Missing required fields"},
                status=400
            )

        room = tbl_chat_room.objects.get(id=room_id)
        brand = tbl_brand.objects.get(id=brand_id)
        influencer = tbl_influencer.objects.get(id=influencer_id)
        product = tbl_product.objects.get(id=product_id)

        req = tbl_request.objects.create(
            room=room,   # only keep this if tbl_request really has a ForeignKey to tbl_chat_room
            from_brand=brand,
            to_influencer=influencer,
            product=product,
            request_amount=amount,
            request_status="0"
        )

        tbl_chat_message.objects.create(
            room=room,
            brand=brand,
            sender_type="brand",
            message_type="request",
            message=f"Offer sent for {product.product_name} - ₹{amount}"
        )

        return JsonResponse({
            "status": "success",
            "request_id": req.id,
            "message": "Request sent in chat"
        })

    except tbl_chat_room.DoesNotExist:
        return JsonResponse({"status": "error", "message": "Room not found"}, status=404)
    except tbl_brand.DoesNotExist:
        return JsonResponse({"status": "error", "message": "Brand not found"}, status=404)
    except tbl_influencer.DoesNotExist:
        return JsonResponse({"status": "error", "message": "Influencer not found"}, status=404)
    except tbl_product.DoesNotExist:
        return JsonResponse({"status": "error", "message": "Product not found"}, status=404)
    except Exception as e:
        return JsonResponse({"status": "error", "message": repr(e)}, status=500)

@csrf_exempt
def AcceptChatRequest(request, rid):
    try:
        req = tbl_request.objects.select_related(
            "room", "from_brand", "to_influencer", "product"
        ).get(id=rid)

        req.request_status = "1"
        req.save()

        tbl_chat_message.objects.create(
            room=req.room,
            influencer=req.to_influencer,
            sender_type="influencer",
            message_type="text",
            message=f"Accepted the offer for {req.product.product_name} - ₹{req.request_amount}"
        )

        return JsonResponse({
            "status": "success",
            "message": "Request accepted"
        })

    except tbl_request.DoesNotExist:
        return JsonResponse({
            "status": "error",
            "message": "Request not found"
        }, status=404)
    except Exception as e:
        return JsonResponse({
            "status": "error",
            "message": str(e)
        }, status=500)  

@csrf_exempt
def RejectChatRequest(request, rid):
    try:
        req = tbl_request.objects.select_related("room", "to_influencer", "product").get(id=rid)
        req.request_status = "2"
        req.save()

        tbl_chat_message.objects.create(
            room=req.room,
            influencer=req.to_influencer,
            sender_type="influencer",
            message_type="text",
            message=f"Rejected the offer for {req.product.product_name}"
        )

        return JsonResponse({"status": "success", "message": "Request rejected"})
    except tbl_request.DoesNotExist:
        return JsonResponse({"status": "error", "message": "Request not found"}, status=404)
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)
    

@csrf_exempt
def BrandChatList(request, bid):
    try:
        rooms = tbl_chat_room.objects.filter(brand_id=bid).select_related("influencer").order_by("-id")

        data = []
        for room in rooms:
            data.append({
                "room_id": room.id,
                "influencer_id": room.influencer.id,
                "influencer_name": room.influencer.influencer_name,
            })

        return JsonResponse({"status": "success", "data": data})
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)
    

@csrf_exempt
def InfluencerChatList(request, iid):
    try:
        rooms = tbl_chat_room.objects.filter(influencer_id=iid).select_related("brand").order_by("-id")

        data = []
        for room in rooms:
            last_msg = tbl_chat_message.objects.filter(room=room).order_by("-created_at").first()
            pending_count = tbl_request.objects.filter(room=room, request_status="0").count()

            data.append({
                "room_id": room.id,
                "brand_id": room.brand.id if room.brand else None,
                "brand_name": room.brand.brand_name if room.brand else "",
                "last_message": last_msg.message if last_msg and last_msg.message else "",
                "last_message_time": last_msg.created_at.strftime("%Y-%m-%d %H:%M:%S") if last_msg else "",
                "pending_requests": pending_count,
            })

        return JsonResponse({
            "status": "success",
            "data": data
        })
    except Exception as e:
        return JsonResponse({
            "status": "error",
            "message": str(e)
        }, status=500)
    


@csrf_exempt
def AcceptedInfluencerRequests(request, iid):
    try:
        requests = tbl_request.objects.filter(
            to_influencer_id=iid,
            request_status="1"
        ).select_related("from_brand", "product").order_by("-id")

        data = []
        for r in requests:
            data.append({
                "id": r.id,
                "brand_id": r.from_brand.id if r.from_brand else None,
                "brand_name": r.from_brand.brand_name if r.from_brand else "",
                "product_id": r.product.id if r.product else None,
                "product_name": r.product.product_name if r.product else "",
                "amount": str(r.request_amount),
                "status": r.request_status,
            })

        return JsonResponse({
            "status": "success",
            "data": data
        })
    except Exception as e:
        return JsonResponse({
            "status": "error",
            "message": str(e)
        }, status=500)
    


@csrf_exempt
def EventDetails(request, eid):
    try:
        e = tbl_event.objects.select_related("event_venue__district", "brand").get(id=eid)

        data = {
            "id": e.id,
            "district_name": e.event_venue.district.district_name,
            "place_name": e.event_venue.place_name,
            "event_date": e.event_date,
            "event_time": e.event_time,
            "event_details": e.event_details,
            "event_promocode": e.event_promocode,
            "brand_name": e.brand.brand_name if e.brand else ""
        }

        return JsonResponse({
            "status": "success",
            "data": data
        })

    except tbl_event.DoesNotExist:
        return JsonResponse({
            "status": "error",
            "message": "Event not found"
        }, status=404)
    


@csrf_exempt
def ApplyEvent(request):
    if request.method != "POST":
        return JsonResponse({"status": "error", "message": "Invalid request"}, status=405)

    try:
        body = json.loads(request.body)
        event_id = body.get("event_id")
        influencer_id = body.get("influencer_id")

        if not event_id or not influencer_id:
            return JsonResponse({
                "status": "error",
                "message": "event_id and influencer_id are required"
            }, status=400)

        event = tbl_event.objects.get(id=event_id)
        influencer = tbl_influencer.objects.get(id=influencer_id)

        already_applied = tbl_event_apply.objects.filter(
            event=event,
            influencer=influencer
        ).first()

        if already_applied:
            return JsonResponse({
                "status": "exists",
                "message": "You have already applied for this event"
            })

        tbl_event_apply.objects.create(
            event=event,
            influencer=influencer,
            apply_status="0"
        )

        return JsonResponse({
            "status": "success",
            "message": "Applied successfully"
        })

    except tbl_event.DoesNotExist:
        return JsonResponse({
            "status": "error",
            "message": "Event not found"
        }, status=404)

    except tbl_influencer.DoesNotExist:
        return JsonResponse({
            "status": "error",
            "message": "Influencer not found"
        }, status=404)

    except Exception as e:
        return JsonResponse({
            "status": "error",
            "message": str(e)
        }, status=500)
    


@csrf_exempt
def InfluencerAppliedEvents(request, iid):
    try:
        applications = tbl_event_apply.objects.select_related(
            "event__event_venue__district",
            "event__brand",
            "influencer"
        ).filter(influencer_id=iid).order_by("-id")

        data = []

        for app in applications:
            data.append({
                "id": app.id,
                "apply_status": app.apply_status,
                "apply_date": app.apply_date.strftime("%Y-%m-%d %H:%M:%S"),
                "event_id": app.event.id,
                "district_name": app.event.event_venue.district.district_name,
                "place_name": app.event.event_venue.place_name,
                "event_date": app.event.event_date,
                "event_time": app.event.event_time,
                "event_details": app.event.event_details,
                "event_promocode": app.event.event_promocode,
                "brand_name": app.event.brand.brand_name if app.event.brand else ""
            })

        return JsonResponse({
            "status": "success",
            "data": data
        })

    except Exception as e:
        return JsonResponse({
            "status": "error",
            "message": str(e)
        }, status=500)
    


@csrf_exempt
def EventApplicants(request, eid):
    try:
        applicants = tbl_event_apply.objects.select_related(
            "influencer",
            "influencer__place__district",
            "event"
        ).filter(event_id=eid).order_by("-id")

        data = []

        for a in applicants:
            data.append({
                "id": a.id,
                "influencer_id": a.influencer.id,
                "influencer_name": a.influencer.influencer_name,
                "influencer_email": a.influencer.influencer_email,
                "influencer_contact": a.influencer.influencer_contact,
                "influencer_photo": request.build_absolute_uri(a.influencer.influencer_photo.url) if a.influencer.influencer_photo else "",
                "district_name": a.influencer.place.district.district_name if a.influencer.place and a.influencer.place.district else "",
                "place_name": a.influencer.place.place_name if a.influencer.place else "",
                "apply_status": a.apply_status,
                "apply_date": a.apply_date.strftime("%Y-%m-%d %H:%M:%S")
            })

        return JsonResponse({
            "status": "success",
            "data": data
        })

    except Exception as e:
        return JsonResponse({
            "status": "error",
            "message": str(e)
        }, status=500)
    

@csrf_exempt
def ApproveEventApply(request, aid):
    try:
        application = tbl_event_apply.objects.get(id=aid)
        application.apply_status = "1"
        application.save()

        return JsonResponse({
            "status": "success",
            "message": "Application approved"
        })

    except tbl_event_apply.DoesNotExist:
        return JsonResponse({
            "status": "error",
            "message": "Application not found"
        }, status=404)
    
@csrf_exempt
def RejectEventApply(request, aid):
    try:
        application = tbl_event_apply.objects.get(id=aid)
        application.apply_status = "2"
        application.save()

        return JsonResponse({
            "status": "success",
            "message": "Application rejected"
        })

    except tbl_event_apply.DoesNotExist:
        return JsonResponse({
            "status": "error",
            "message": "Application not found"
        }, status=404)
    


@csrf_exempt
def PaymentDetails(request, bookingid):
    try:
        booking = tbl_booking.objects.select_related("user", "address").get(id=bookingid)

        data = {
            "booking_id": booking.id,
            "booking_amount": str(booking.booking_amount) if booking.booking_amount else "0.00",
            "booking_status": int(booking.booking_status),
            "booking_date": str(booking.booking_date),
            "address_line": booking.address.address_line if booking.address else "",
            "pincode": booking.address.pincode if booking.address else "",
            "user_name": booking.user.user_name if booking.user else "",
        }

        return JsonResponse({
            "status": "success",
            "data": data
        })

    except tbl_booking.DoesNotExist:
        return JsonResponse({
            "status": "error",
            "message": "Booking not found"
        }, status=404)
    

@csrf_exempt
def ViewApplyEvent(request, eid):
    try:
        applications = tbl_event_apply.objects.filter(event_id=eid).select_related(
            "influencer",
            "influencer__place"
        )

        data = []
        for app in applications:
            influencer = app.influencer

            data.append({
                "application_id": app.id,
                "apply_status": app.apply_status,
                "apply_date": app.apply_date,
                "influencer_id": influencer.id,
                "influencer_name": influencer.influencer_name,
                "influencer_email": influencer.influencer_email,
                "influencer_photo": request.build_absolute_uri(influencer.influencer_photo.url) if influencer.influencer_photo else "",
                "influencer_place": influencer.place.place_name if influencer.place else "",
                "influencer_link": influencer.influencer_link if influencer.influencer_link else "",
            })

        return JsonResponse({"data": data})

    except Exception as e:
        print("ViewApplyEvent Error:", e)
        return JsonResponse({
            "status": "failed",
            "message": str(e)
        }, status=500)
    





@csrf_exempt
def Complaint(request, uid=None):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            user_id = data.get("user_id")
            complaint_title = data.get("complaint_title")
            complaint_content = data.get("complaint_content")

            if not user_id or not complaint_title or not complaint_content:
                return JsonResponse({"msg": "All fields are required"}, status=400)

            user = tbl_user.objects.get(id=user_id)

            tbl_complaint.objects.create(
                complaint_title=complaint_title,
                complaint_content=complaint_content,
                complaint_reply="",
                complaint_status="pending",
                user=user
            )

            return JsonResponse({"msg": "Complaint Added Successfully"})

        except tbl_user.DoesNotExist:
            return JsonResponse({"msg": "User not found"}, status=404)
        except Exception as e:
            return JsonResponse({"msg": "Error", "error": str(e)}, status=500)

    elif request.method == "GET":
        try:
            if uid:
                complaints = tbl_complaint.objects.filter(user_id=uid).select_related("user")
            else:
                complaints = tbl_complaint.objects.all().select_related("user")

            data = []
            for i in complaints:
                data.append({
                    "id": i.id,
                    "complaint_title": i.complaint_title,
                    "complaint_content": i.complaint_content,
                    "complaint_reply": i.complaint_reply,
                    "complaint_status": i.complaint_status,
                    "user_id": i.user.id,
                    "user_name": i.user.user_name,
                    "user_email": i.user.user_email,
                })

            return JsonResponse({"data": data})

        except Exception as e:
            return JsonResponse({"msg": "Error", "error": str(e)}, status=500)

    return JsonResponse({"msg": "Invalid Request"}, status=400)


@csrf_exempt
def DeleteComplaint(request, did):
    if request.method == "DELETE":
        try:
            complaint = tbl_complaint.objects.get(id=did)
            complaint.delete()
            return JsonResponse({"msg": "Complaint Deleted Successfully"})
        except tbl_complaint.DoesNotExist:
            return JsonResponse({"msg": "Complaint not found"}, status=404)
        except Exception as e:
            return JsonResponse({"msg": "Error", "error": str(e)}, status=500)

    return JsonResponse({"msg": "Invalid Request"}, status=400)


@csrf_exempt
def ReplyComplaint(request, rid):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            reply = data.get("complaint_reply")

            if not reply:
                return JsonResponse({"msg": "Reply is required"}, status=400)

            complaint = tbl_complaint.objects.get(id=rid)
            complaint.complaint_reply = reply
            complaint.complaint_status = "replied"
            complaint.save()

            return JsonResponse({"msg": "Reply Sent Successfully"})

        except tbl_complaint.DoesNotExist:
            return JsonResponse({"msg": "Complaint not found"}, status=404)
        except Exception as e:
            return JsonResponse({"msg": "Error", "error": str(e)}, status=500)

    return JsonResponse({"msg": "Invalid Request"}, status=400)




@csrf_exempt
def BrandPaymentDetails(request, rid):
    try:
        req = tbl_request.objects.select_related(
            "from_brand",
            "to_influencer",
            "product",
            "room"
        ).get(id=rid)

        data = {
            "request_id": req.id,
            "room_id": req.room.id if req.room else None,
            "brand_id": req.from_brand.id if req.from_brand else None,
            "brand_name": req.from_brand.brand_name if req.from_brand else "",
            "influencer_id": req.to_influencer.id if req.to_influencer else None,
            "influencer_name": req.to_influencer.influencer_name if req.to_influencer else "",
            "product_id": req.product.id if req.product else None,
            "product_name": req.product.product_name if req.product else "",
            "amount": str(req.request_amount),
            "status": str(req.request_status),
            "payment_status": str(getattr(req, "payment_status", "0")),
        }

        return JsonResponse({
            "status": "success",
            "data": data
        })

    except tbl_request.DoesNotExist:
        return JsonResponse({
            "status": "error",
            "message": "Request not found"
        }, status=404)
    except Exception as e:
        return JsonResponse({
            "status": "error",
            "message": str(e)
        }, status=500)


@csrf_exempt
def BrandPaymentComplete(request):
    if request.method != "POST":
        return JsonResponse({
            "status": "error",
            "message": "Invalid request"
        }, status=405)

    try:
        body = json.loads(request.body)

        request_id = body.get("request_id")
        payment_method = body.get("payment_method", "")
        payment_status = body.get("payment_status", "completed")

        if not request_id:
            return JsonResponse({
                "status": "error",
                "message": "request_id is required"
            }, status=400)

        req = tbl_request.objects.select_related(
            "room", "from_brand", "to_influencer", "product"
        ).get(id=request_id)

        if str(req.request_status) != "1":
            return JsonResponse({
                "status": "error",
                "message": "Only accepted offers can be paid"
            }, status=400)

        # save payment info on request
        # make sure these fields exist in tbl_request model:
        # payment_status, payment_method, paid_at
        req.payment_status = "1"
        req.payment_method = payment_method
        req.save()

        if hasattr(req, "paid_at"):
            from django.utils import timezone
            req.paid_at = timezone.now()
            req.save()

        # add system message in chat
        if req.room:
            tbl_chat_message.objects.create(
                room=req.room,
                brand=req.from_brand,
                sender_type="brand",
                message_type="text",
                message=f"Payment completed for {req.product.product_name} - ₹{req.request_amount} via {payment_method.upper()}"
            )

        return JsonResponse({
            "status": "success",
            "message": "Payment completed successfully"
        })

    except tbl_request.DoesNotExist:
        return JsonResponse({
            "status": "error",
            "message": "Request not found"
        }, status=404)
    except Exception as e:
        return JsonResponse({
            "status": "error",
            "message": str(e)
        }, status=500)