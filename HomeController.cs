using PartsService.Models;
using PartsService.ModelVM;
using PartsService.OtherProviders;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Web;
using System.Web.Http;

namespace PartsService.Controllers
{
    public class HomeController : ApiController
    {
        [Authorize]
        [HttpGet]
        [Route("api/home/menus")]
        public IHttpActionResult GetMenu()
        {
            var att = new GetAttributeController();
            long roleid = Convert.ToInt64(att.GetRoleId(User.Identity));
            string userDomain = att.GetDomain(User.Identity);
            string subdomain= att.GetSubdomain(User.Identity);
            using (SpareDBContext db = new SpareDBContext())
            {
                List<MenuVM> menus = db.Menus.Where(b => b.ParentPageID == 0 && b.IsActive == true)
                .Select(a => new MenuVM()
                {
                    PageID = a.PageID,
                    Title = a.Title,
                    Description = a.Description,
                    ParentID = a.ParentPageID,
                    URL = a.URL,
                    Priority=a.Priority
                }).OrderBy(b=>b.Priority).ToList();

                if (menus != null && menus.Count > 0)
                {
                    List<SubMenu> submenus = null;
                    foreach (MenuVM m in menus)
                    {
                        if (userDomain.ToUpper() != "M")
                        {
                            submenus = db.Menus.Where(b => b.ParentPageID != 0 && b.ParentPageID == m.PageID && b.PagePerms.Any(c => c.RoleID == roleid) && b.Domain.ToLower()==userDomain.ToLower() && b.SubDomain.Trim().ToLower()==subdomain.Trim().ToLower() && b.IsActive == true)
                            .Select(a => new SubMenu()
                            {
                                SubID = a.PageID,
                                SubTitle = a.Title,
                                SubDescription = a.Description,
                                SubParentID = a.ParentPageID,
                                SubURL = a.URL,
                                Priority=a.Priority
                            }).OrderBy(b => b.Priority).ToList();
                        }
                        else
                        {
                            submenus = db.Menus.Where(b => b.ParentPageID != 0 && b.ParentPageID == m.PageID && b.SubDomain.Trim().ToLower() == subdomain.Trim().ToLower() && b.PagePerms.Any(c => c.RoleID == roleid) && b.IsActive == true)
                            .Select(a => new SubMenu()
                            {
                                SubID = a.PageID,
                                SubTitle = a.Title,
                                SubDescription = a.Description,
                                SubParentID = a.ParentPageID,
                                SubURL = a.URL,
                                Priority = a.Priority
                            }).OrderBy(b => b.Priority).ToList();
                        }
                        
                        if (submenus != null && submenus.Count > 0)
                        {
                            m.SubMenus.AddRange(submenus);
                        }
                    }
                    return Ok(menus);
                }
                else
                {
                    return NotFound();
                }
            }
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("api/home/forall")]
        public IHttpActionResult Get()
        {
            return Ok("Now server date-time is : " + DateTime.Now.ToString());
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("api/home/finyrs")]
        public IHttpActionResult GetFinancialYear()
        {
            List<FinyearVM> finYears = new List<FinyearVM>();
            using (SpareDBContext db = new SpareDBContext())
            {
                finYears = db.FinancialYears.Select(a => new FinyearVM() { FinYearID = a.FinYearID, Description = a.Description }).ToList();
            }

            return Ok(finYears);
        }

        [Authorize]
        [HttpGet]
        [Route("api/home/authenticate")]
        public IHttpActionResult GetForAuthenticate()
        {
            var identity = (ClaimsIdentity)User.Identity;
            return Ok("Hello " + identity.Name);
        }

        [Authorize(Roles = "sa")]
        [HttpGet]
        [Route("api/home/authorize")]
        public IHttpActionResult GetForAdmin()
        {
            var identity = (ClaimsIdentity)User.Identity;
            var roles = identity.Claims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value);
            return Ok("Hello " + identity.Name + " Role:" + string.Join(",", roles.ToList()));
        }

        //For OTP Login System
        [AllowAnonymous]
        [HttpGet]
        [Route("api/home/login")]
        public HttpResponseMessage Login(string u, string p)
        {
            string otp = string.Empty;
            bool flag = false;
            using (SpareDBContext db = new SpareDBContext())
            {
                try
                {
                    string encriptedPassword = Common.EncryptData(p);
                    LoginUser usr = db.LoginUsers.FirstOrDefault(a => a.LoginID.Trim().Equals(u, StringComparison.OrdinalIgnoreCase) && a.Password.Equals(encriptedPassword) && a.HasOTP == false);
                    if (usr != null)
                    {
                        otp = OTPProvider.GetOTP();
                        usr.Token = Common.EncryptData(otp);
                        usr.HasOTP = true;
                        db.SaveChanges();
                        if (!string.IsNullOrEmpty(usr.Phone.ToString()))
                        {
                            flag = SMSProvider.SendSMS(usr.Phone.ToString(), otp);
                        }
                        if (flag)
                        {
                            return Request.CreateResponse(HttpStatusCode.OK, "OTP Send To Your Registered Mobile.");
                        }
                        return Request.CreateResponse(HttpStatusCode.Unauthorized, "Please register a mobole no first.");
                    }
                    else
                    {
                        return Request.CreateResponse(HttpStatusCode.NotFound, "User Not Found, Please Cheak Combination!");
                    }
                }
                catch 
                {
                    return Request.CreateResponse(HttpStatusCode.InternalServerError, "Internal server Error!");
                }
                
            }
        }

    }
    public class MenuVM
    {
        public MenuVM()
        {
            SubMenus = new List<SubMenu>();
        }

        public long PageID { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string URL { get; set; }
        public long ParentID { get; set; }
        public string Domain { get; set; }
        public int Priority { get; set; }
        public List<SubMenu> SubMenus { get; set; }
    }
    public class SubMenu
    {
        public long SubID { get; set; }
        public string SubTitle { get; set; }
        public string SubDescription { get; set; }
        public string SubURL { get; set; }
        public long SubParentID { get; set; }
        public string Domain { get; set; }
        public int Priority { get; set; }
    }
}
