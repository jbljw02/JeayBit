# from rest_framework.authentication import SessionAuthentication
from rest_framework.authentication import SessionAuthentication

class CsrfExemptSessionAuthentication(SessionAuthentication):
    
    def enforce_csrf(self, request):
        """
        Enforce CSRF validation for session based authentication.
        """
        return None
        # def dummy_get_response(request):  # pragma: no cover
        #     return None

        # check = CSRFCheck(dummy_get_response)
        # # populates request.META['CSRF_COOKIE'], which is used in process_view()
        # check.process_request(request)
        # reason = check.process_view(request, None, (), {})
        # if reason:
        #     # CSRF failed, bail with explicit error message
        #     raise exceptions.PermissionDenied('CSRF Failed: %s' % reason)