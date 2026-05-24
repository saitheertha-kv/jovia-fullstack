
from django.urls import path
from server import views  # import from project folder
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('District/', views.District),
    path('DeleteDistrict/<int:did>/', views.DeleteDistrict),  
    path('EditDistrict/<int:did>/', views.EditDistrict),  

    path('Category/', views.Category),
    path('DeleteCategory/<int:did>/', views.DeleteCategory),  
    path('EditCategory/<int:did>/', views.EditCategory),
    path('Admin/', views.Admin),

    path('Place/', views.Place),
    path('DeletePlace/<int:pid>/', views.DeletePlace),   # new
    path('EditPlace/<int:pid>/', views.EditPlace),   


     # --------- SUBCATEGORY ---------
    path('Subcategory/', views.Subcategory),
    path('DeleteSubcategory/<int:sid>/', views.DeleteSubcategory),
    path('EditSubcategory/<int:sid>/', views.EditSubcategory),
    path('SubcategoryByCategory/<int:cid>/', views.SubcategoryByCategory),


    path('BrandReg/', views.BrandReg),
    path('BrandProfile/<int:bid>/', views.BrandProfile),
    path('UpdateBrandProfile/<int:bid>/', views.UpdateBrandProfile),
    path('ChangeBrandPassword/<int:bid>/', views.ChangeBrandPassword),
    path('PendingBrands/', views.PendingBrands),
    path('AcceptedBrands/', views.AcceptedBrands),
    path('RejectedBrands/', views.RejectedBrands),

    path('AcceptBrand/<int:bid>/', views.AcceptBrand),
    path('RejectBrand/<int:bid>/', views.RejectBrand),

    path('Userreg/', views.Userreg),
    path('UserProfile/<int:uid>/', views.UserProfile),
    path('UpdateUserProfile/<int:uid>/', views.UpdateUserProfile),
    path('ChangeUserPassword/<int:uid>/', views.ChangeUserPassword),

    path('InfluencerReg/', views.InfluencerReg),
    path('InfluencerProfile/<int:iid>/', views.InfluencerProfile),
    path('UpdateInfluencerProfile/<int:iid>/', views.UpdateInfluencerProfile),
    path('ChangeInfluencerPassword/<int:iid>/', views.ChangeInfluencerPassword),
    path('PlaceByDistrict/<int:did>/', views.PlaceByDistrict),

    path('Login/', views.Login),

     path('BrandProduct/<int:bid>/', views.BrandProduct),
     path('AllProduct/', views.AllProduct),
     path("ProductDetails/<int:pid>/", views.ProductDetails),
    path('UpdateProduct/<int:pid>/', views.UpdateProduct),
    path('DeleteProduct/<int:pid>/', views.DeleteProduct),

path('AllProduct/', views.AllProduct),
path('AddtoCart/', views.AddtoCart),

path('ViewCart/<int:uid>/', views.ViewCart),
path('UpdateCartQty/', views.UpdateCartQty),
path('DeleteCart/<int:cid>/', views.DeleteCart),

path('Checkout/', views.Checkout),
path('PaymentComplete/', views.PaymentComplete),        
   path('post/', views.Post),

     path('addlink/', views.AddLink),

 path('addstock/', views.addstock),
 path("ProductStock/<int:pid>/", views.ProductStock),

 path('SearchInfluencer/', views.SearchInfluencer),
 path('BrandProducts/<int:bid>/', views.BrandProducts),
path('AddRequest/', views.AddRequest),
path('BrandRequests/<int:bid>/', views.BrandRequests),
path('InfluencerRequests/<int:iid>/', views.InfluencerRequests),
path('AcceptRequest/<int:rid>/', views.AcceptRequest),
path('RejectRequest/<int:rid>/', views.RejectRequest),
path('InfluencerPosts/<int:iid>/', views.InfluencerPosts),
path('AllPosts/', views.AllPosts),  
path('ToggleLike/', views.ToggleLike),
path('AddComment/', views.AddComment),
path('AddReply/', views.AddReply),
path('GetComments/<int:pid>/', views.GetComments),




path('District/',views.District),
path('PlaceByDistrict/<int:id>/',views.PlaceByDistrict),

path('AddEvent/<int:id>/',views.AddEvent),
path('BrandEvent/<int:id>/',views.BrandEvent),

 path('AllEvent/', views.AllEvent),
 path('GetComments/<int:pid>/', views.GetComments),
  path("GetAddress/<int:uid>/", views.GetAddress),
    path("AddAddress/", views.AddAddress),
    path("DeleteAddress/<int:aid>/", views.DeleteAddress),
    path("MyBookings/<int:uid>/",views.MyBookings),

    path("BrandPosts/<int:bid>/", views.BrandPosts),

    path("AddProductImage/", views.AddProductImage),
path("ProductImages/<int:pid>/", views.ProductImages),
path("DeleteProductImage/<int:id>/", views.DeleteProductImage),

path("BrandBookings/<int:bid>/", views.BrandBookings),
path("UpdateBrandCartStatus/<int:cid>/<str:status>/", views.UpdateBrandCartStatus),

path("PendingInfluencers/", views.PendingInfluencers),
path("AcceptedInfluencers/", views.AcceptedInfluencers),
path("RejectedInfluencers/", views.RejectedInfluencers),
path("AcceptInfluencer/<int:iid>/", views.AcceptInfluencer),
path("RejectInfluencer/<int:iid>/", views.RejectInfluencer),
path('DeleteComment/<int:cid>/', views.DeleteComment),

path('UserInfluencerPosts/<int:iid>/', views.UserInfluencerPosts),
path('UserInfluencerProfile/<int:iid>/', views.UserInfluencerProfile),


path("MyBrandRequests/<int:bid>/", views.MyBrandRequests),

path("GetOrCreateChatRoom/", views.GetOrCreateChatRoom),
path("ViewRoomMessages/<int:room_id>/", views.ViewRoomMessages),
path("SendRoomMessage/", views.SendRoomMessage),
path("SendRequestInChat/", views.SendRequestInChat),
path("AcceptChatRequest/<int:rid>/", views.AcceptChatRequest),
path("RejectChatRequest/<int:rid>/", views.RejectChatRequest),
path("BrandChatList/<int:bid>/", views.BrandChatList),
path("InfluencerChatList/<int:iid>/", views.InfluencerChatList),

path("AcceptedInfluencerRequests/<int:iid>/", views.AcceptedInfluencerRequests),

path("EventDetails/<int:eid>/", views.EventDetails),
path("ApplyEvent/", views.ApplyEvent),
path("InfluencerAppliedEvents/<int:iid>/", views.InfluencerAppliedEvents),
path("EventApplicants/<int:eid>/", views.EventApplicants),
path("ApproveEventApply/<int:aid>/", views.ApproveEventApply),
path("RejectEventApply/<int:aid>/", views.RejectEventApply),

path("PaymentDetails/<int:bookingid>/", views.PaymentDetails, name="PaymentDetails"),

path("ViewApplyEvent/<int:eid>/", views.ViewApplyEvent, name="ViewApplyEvent"),

 path("Complaint/", views.Complaint, name="Complaint"),
    path("Complaint/<int:uid>/", views.Complaint, name="ComplaintByUser"),
    path("DeleteComplaint/<int:did>/", views.DeleteComplaint, name="DeleteComplaint"),
    path("ReplyComplaint/<int:rid>/", views.ReplyComplaint, name="ReplyComplaint"),
    path("BrandPaymentDetails/<int:rid>/", views.BrandPaymentDetails),
path("BrandPaymentComplete/", views.BrandPaymentComplete),

]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)