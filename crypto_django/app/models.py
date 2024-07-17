from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group, Permission
from django.db import models
from django.utils.translation import gettext_lazy as _
import uuid
from django.utils import timezone

# 모델과 관련된 DB 작업을 담당하는 매니저 클래스
class CustomUserManager(BaseUserManager):
    # 회원가입 기능은 DB와 밀접하게 관련이 있기 때문에 해당 위치에 정의
    def create_user(self, username, email, password):
        if not email:
            raise ValueError('Users must have an email address')

        # 모델에 사용자 이름과 이메일을 할당
        user = self.model(
            username=username,
            email=self.normalize_email(email),
        )

        user.set_password(password)  # 패스워드는 set_password 메소드를 쓰기 위해 별도로 선언(비밀번호를 해시화하여 저장해 평문을 알 수 없게 함)
        user.save(using=self._db)  # DB에 값을 저장
        return user
    
    # 관리자 계정 생성 메소드
    def create_superuser(self, username, email, password):
        user = self.create_user(username, email, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user 

# 실제 사용자 데이터를 표현하는 모델
# AbstraceBaseUser는 password, last_name을 가지고 있는 모델, PermissionsMixin는 groups 및 user_permissions 제공
class CustomUser(AbstractBaseUser, PermissionsMixin):
    # 패스워드는 상속받아 왔기 때문에 선언하지 않음
    username = models.CharField(max_length=30)
    email = models.EmailField(unique=True)
    balance = models.DecimalField(max_digits=200, decimal_places=0, default=0) 
    
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    date_joined = models.DateTimeField(default=timezone.now)
    
    is_staff = models.BooleanField(default=False)  # 관리자 사이트에 로그인 가능한지 여부
    is_superuser = models.BooleanField(default=False)  # 슈퍼유저인지 여부
    is_active = models.BooleanField(default=True)  # 계정 활성화 여부

    # groups = models.ManyToManyField(
    #     to=Group,
    #     verbose_name=_('groups'),
    #     blank=True,
    #     help_text=_(
    #         'The groups this user belongs to. A user will get all permissions '
    #         'granted to each of their groups.'
    #     ),
    #     related_query_name="customuser",
    #     related_name="customuser_set",
    #  )
    
    # user_permissions = models.ManyToManyField(
    #      to=Permission,
    #      verbose_name=_('user permissions'),
    #      blank=True,
    #      help_text=_('Specific permissions for this user.'),
    #      related_query_name="customuser",
    #      related_name="customuser_set",
    #  )

    objects = CustomUserManager()

    USERNAME_FIELD = 'email' # 로그인 시 식별자로 사용되는 필드
    REQUIRED_FIELDS = ['username'] # 관리자 계정 생성 시 반드시 입력해야 하는 필드  
    
    
# 화폐의 이름과 가격을 담는 테이블
class Crypto(models.Model):
    name = models.CharField(max_length=200)
    price = models.FloatField()
    
    def __str__(self):
        return self.name

# 화폐의 관심 여부와 소유 여부를 담는 테이블
# user, crypto는 각각 외래키로서 각각 CustomerUser, Crypto 테이블을 참조
class UserCrypto(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    crypto = models.ForeignKey(Crypto, on_delete=models.CASCADE)
    is_favorited = models.BooleanField(default=False)
    is_owned = models.BooleanField(default=False)
    owned_quantity = models.DecimalField(max_digits=30, decimal_places=8, default=0.00)
    
    def __str__(self):
        return f"{self.user.email} - {self.crypto.name} - {self.owned_quantity}"

# 거래내역을 저장하는 테이블
class TradeHistory(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE) 
    crypto = models.ForeignKey(Crypto, on_delete=models.CASCADE) 

    TRADE_CATEGORIES = [('BUY', '매수'), ('SELL', '매도')]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    trade_category = models.CharField(max_length=200, choices=TRADE_CATEGORIES, default='BUY')
    trade_time = models.DateTimeField(auto_now_add=True) 
    crypto_market = models.CharField(max_length=200)
    crypto_price = models.FloatField()
    trade_price = models.DecimalField(max_digits=30, decimal_places=0)
    trade_amount = models.DecimalField(max_digits=30, decimal_places=8)
    is_signed = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.id} - {self.trade_category} - {self.trade_time} - {self.user.email} - {self.crypto.name} - {self.crypto_price} - {self.trade_price} - {self.trade_amount} - {self.is_signed}"

# 백그라운드에서 거래가 체결됐을 때 해당 이벤트를 저장할 테이블 
class TradeEvent(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_sent = models.BooleanField(default=False)