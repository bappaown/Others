using PartsService.Models;
using PartsService.ModelVM;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using static PartsService.Models.SpareDBContext;

namespace PartsService.Controllers
{
    [Authorize]
    public class PartsSaleController : ApiController
    {
        [Route("api/ps/Its")]
        [HttpGet]
        public HttpResponseMessage GetItems(long finid, string partNo)
        {
            var gat = new GetAttributeController();
            long cid = Convert.ToInt64(gat.GetCopmpanyId(User.Identity));
            long bid = Convert.ToInt64(gat.GetBranchId(User.Identity));

            OutwadDetailVM item = null;
            using (SpareDBContext db = new SpareDBContext())
            {
                try
                {
                    //items = (from i in db.Items.Where(a => a.ItemCode.Trim().ToLower() == partNo.Trim().ToLower() && a.CompanyID == cid).ToList()
                    //            join ist in db.ItemStocks.Where(b => b.CompanyID == cid && b.BranchID == bid && b.FinyearID == finid) on i.ItemID equals ist.ItemID
                    //            into stk
                    //            from ist in stk.DefaultIfEmpty()
                    //            select new OutwardDetailVM()
                    //            {
                    //                LineID = 0,
                    //                InwardID = 0,
                    //                ItemID = i.ItemID,
                    //                ItemCode = i.ItemCode,
                    //                ItemName = i.ItemName,
                    //                StockID = ist!=null?ist.StockID:0,
                    //                RackNo = ist!=null?ist.RackNo:"",
                    //                MRP = ist!=null?ist.MRP:i.MRP,
                    //                StockQty = ist != null?ist.ClosingQty:0,
                    //                Qty = 0,
                    //                Rate = 0,
                    //                Gross = 0,
                    //                DiscPercent = 0,
                    //                DiscAmt = 0,
                    //                Taxable = 0,
                    //                GSTPercent = i.GST,
                    //                CGSTPercent = i.CGST,
                    //                CGSTAmt = 0,
                    //                SGSTPercent = i.SGST,
                    //                SGSTmt = 0,
                    //                IGSTPercent = i.GST,
                    //                IGSTAmt = 0,
                    //                NetAmt = 0,
                    //            }).ToList();

                    item = db.ItemStocks.Where(a => a.CompanyID == cid && a.ItemCode.Trim().ToLower() == partNo.Trim().ToLower() && a.BranchID == bid && a.FinyearID == finid).ToList().Select(a => new OutwadDetailVM()
                    {
                        LineID = 0,
                        OutwardID = 0,
                        ItemID = a.ItemID,
                        ItemCode = a.ItemCode,
                        ItemName = a.Item.ItemName,
                        StockID = a.StockID,
                        RackNo = a.RackNo,
                        MRP = a.Item.MRP,
                        StockQty = a.ClosingQty,
                        Qty = 0,
                        Rate = Math.Round((a.MRP * 100) / (100 + a.Item.GST), 2, MidpointRounding.AwayFromZero),
                        Gross = 0,
                        DiscPercent = 0,
                        DiscAmt = 0,
                        Taxable = 0,
                        GSTPercent = a.Item.GST,
                        CGSTPercent = a.Item.CGST,
                        CGSTAmt = 0,
                        SGSTPercent = a.Item.SGST,
                        SGSTmt = 0,
                        IGSTPercent = a.Item.GST,
                        IGSTAmt = 0,
                        NetAmt = 0,
                    }).FirstOrDefault();
                    if (item != null)
                    {
                        return Request.CreateResponse(HttpStatusCode.OK, item);
                    }
                    else
                    {
                        return Request.CreateResponse(HttpStatusCode.NotFound, "No Item Found.");
                    }
                }
                catch
                {
                    return Request.CreateResponse(HttpStatusCode.InternalServerError, "Internal Server Error!");
                }
            }

        }

        [Route("api/ps/sb")]
        [HttpGet]
        public HttpResponseMessage GetSubledger()
        {
            var gat = new GetAttributeController();
            long cid = Convert.ToInt64(gat.GetCopmpanyId(User.Identity));
            long bid = Convert.ToInt64(gat.GetBranchId(User.Identity));
            List<PartyVM> party = null;
            using (SpareDBContext db = new SpareDBContext())
            {
                try
                {
                    party = db.BrunchParties.Where(a => a.CompanyID == cid && a.BranchID == bid && a.IsDeleted != true && a.SubTypeID == (int)SubledgerTypeEnum.SUNDRYDEBTORS).ToList().Select(b => new PartyVM()
                    {
                        PartyID = b.PartyID,
                        CompanyID = b.CompanyID,
                        BranchID = b.BranchID,
                        SubLedgerID = b.SubLedgerID,
                        SubLedgerCode = b.SubLedgerCode,
                        SubLedgerName = b.SubLedgerName,
                        MainLedgerID = b.MainLedgerID,
                        MainLedgerName = b.MainLedger.MainLedgerName,
                        SubTypeID = b.SubTypeID,
                        SubType = b.SubLedgerType.TypeName,
                        Address = b.Address,
                        StateID = b.StateID,
                        StateName = b.State.StateName,
                        StateCode = b.State.Code,
                        ContactPerson = b.ContactPerson,
                        Mobile = b.Mobile,
                        EMAIL = b.EMAIL,
                        GSTNo = b.GSTNo,
                        PAN = b.PAN,
                        BankName = b.BankName,
                        IFSCCode = b.IFSCCode,
                        BankACNo = b.BankACNo,
                    }).ToList();

                    return Request.CreateResponse(HttpStatusCode.OK, party);
                }
                catch (Exception ex)
                {
                    return Request.CreateResponse(HttpStatusCode.InternalServerError, "Internal Server Error!");
                }
            }

        }

        [Route("api/ps/typ")]
        [HttpGet]
        public HttpResponseMessage GetBillType()
        {
            using (SpareDBContext db = new SpareDBContext())
            {
                List<BillTypeVM> types = null;
                try
                {
                    types = db.BillTypes.ToList().Select(a => new BillTypeVM()
                    {
                        TypeID = a.TypeID,
                        Code = a.Code,
                        Description = a.Description
                    }).ToList();
                    return Request.CreateResponse(HttpStatusCode.OK, types);
                }
                catch (Exception ex)
                {
                    return Request.CreateResponse(HttpStatusCode.InternalServerError, "internal Server Error!");
                }
            }
        }


        [Route("api/ps/ssb")]
        [HttpPost]
        public HttpResponseMessage SaveSaleBill(OutwardVM o)
        {
            var gat = new GetAttributeController();
            long cid = Convert.ToInt64(gat.GetCopmpanyId(User.Identity));
            long bid = Convert.ToInt64(gat.GetBranchId(User.Identity));
            string bcode = gat.GetBranchCode(User.Identity);
            ForPrintVM p = new ForPrintVM();
            string itemCodeList = string.Empty;
            using (SpareDBContext db = new SpareDBContext())
            {
                OutwardHDR owh = null;
                List<OutwardDTL> odtls = new List<OutwardDTL>();
                using (var transac = db.Database.BeginTransaction())
                {
                    try
                    {
                        if (o.OutwardID > 0)
                        {
                            owh = db.OutwardHDRs.FirstOrDefault(a => a.OutwardID == o.OutwardID && a.CompanyID == o.CompanyID && a.FinyearID == o.FinyearID && a.BranchID == bid);
                            p.EntityCode = owh.OutwardNo;
                        }
                        else
                        {
                            owh = new OutwardHDR();
                            var s = GetOutwardNo(cid, bid, o.FinyearID);
                            db.Entry(owh).State = System.Data.Entity.EntityState.Added;
                            owh.OutwardSrl = Convert.ToInt64(s.Split('$')[0]);
                            owh.OutwardNo = p.EntityCode = s.Split('$')[1];
                            owh.CompanyID = cid;
                            owh.BranchID = bid;
                            owh.FinyearID = o.FinyearID;
                        }
                        owh.OutwardDate = Convert.ToDateTime(o.OutwardDate);
                        owh.BillTypeID = o.BillTypeID;
                        owh.SubledgerID = o.SubledgerID;
                        owh.PurchaseOrderID = o.PurchaseOrderID != null ? o.PurchaseOrderID : null;

                        #region fro existing Outward Detail and Item Stock

                        if (owh.OutwardDTLs != null && owh.OutwardDTLs.Count > 0)
                        {
                            owh.OutwardDTLs.ForEach(a =>
                            {
                                var ist = db.ItemStocks.FirstOrDefault(b => b.StockID == a.StockID);
                                if (ist != null)
                                {
                                    ist.SaleQty -= a.Qty;
                                    ist.ClosingQty += a.Qty;
                                }
                            });
                            db.OutwardDTLs.RemoveRange(owh.OutwardDTLs);
                            db.SaveChanges();
                        }
                        #endregion

                        #region for new Details Entry
                        if (o.OutwadDetailsVM != null && o.OutwadDetailsVM.Count > 0)
                        {
                            long stid = 0;
                            o.OutwadDetailsVM.ForEach(a =>
                            {
                                stid = 0;
                                var st = db.ItemStocks.FirstOrDefault(b => b.ItemID == a.ItemID && b.CompanyID == cid && b.BranchID == bid && b.FinyearID == owh.FinyearID && b.ClosingQty >= a.Qty);
                                if (st != null)
                                {
                                    stid = st.StockID;
                                    st.SaleQty += a.Qty;
                                    st.ClosingQty -= a.Qty;
                                    //db.SaveChanges();
                                    odtls.Add(
                                    new OutwardDTL()
                                    {
                                        ItemID = a.ItemID,
                                        StockID = stid,
                                        RackNo = a.RackNo,
                                        MRP = a.MRP,
                                        Qty = a.Qty,
                                        Rate = a.Rate,
                                        Gross = a.Gross,
                                        DiscPercent = a.DiscPercent,
                                        DiscAmt = a.DiscAmt,
                                        Taxable = a.Taxable,
                                        CGSTPercent = a.CGSTPercent,
                                        CGSTAmt = a.CGSTAmt,
                                        SGSTPercent = a.SGSTPercent,
                                        SGSTmt = a.SGSTmt,
                                        IGSTPercent = a.IGSTPercent,
                                        IGSTAmt = a.IGSTAmt,
                                        NetAmt = a.NetAmt
                                    });
                                }
                                else
                                {
                                    if (string.IsNullOrEmpty(itemCodeList))
                                    {
                                        itemCodeList = a.ItemCode;
                                    }
                                    else
                                    {
                                        itemCodeList += "," + a.ItemCode;
                                    }

                                }
                            });
                            owh.OutwardDTLs.AddRange(odtls);
                        }
                        owh.TotalGross = odtls.Sum(a => a.Gross);
                        owh.TotalDiscount = odtls.Sum(a => a.DiscAmt);
                        owh.TotalTaxable = odtls.Sum(a => a.Taxable);
                        owh.TotalCGST = odtls.Sum(a => a.CGSTAmt);
                        owh.TotalSGST = odtls.Sum(a => a.SGSTmt);
                        owh.TotalIGST = odtls.Sum(a => a.IGSTAmt);
                        owh.TotalNetAmt = o.TotalNetAmt;
                        owh.RoundOff = o.RoundOff;
                        owh.TotalTCSAmount = o.TotalTCSAmount;
                        owh.IsTCS = o.IsTCS;

                        #endregion
                        if (odtls.Count == o.OutwadDetailsVM.Count)
                        {
                            db.SaveChanges();
                            p.EntityID = owh.OutwardID;
                            transac.Commit();
                            if (o.OutwardID > 0)
                            {
                                return Request.CreateResponse(HttpStatusCode.OK, p);
                            }
                            return Request.CreateResponse(HttpStatusCode.Created, p);
                        }
                        else
                        {
                            transac.Rollback();
                            return Request.CreateResponse(HttpStatusCode.BadRequest, "Insufficient Closing Qty! Please remove or edite the bill items code (" + itemCodeList + ")");
                        }
                    }
                    catch (Exception ex)
                    {
                        transac.Rollback();
                        return Request.CreateResponse(HttpStatusCode.InternalServerError, "Internal Server Error!");
                    }
                }
            }
        }

        [Route("api/ps/gsc")]
        [HttpGet]
        public HttpResponseMessage GetSaleList(long finyearId)
        {
            var gat = new GetAttributeController();
            long cid = Convert.ToInt64(gat.GetCopmpanyId(User.Identity));
            long bid = Convert.ToInt64(gat.GetBranchId(User.Identity));
            using (SpareDBContext db = new SpareDBContext())
            {
                List<string> str = new List<string>();
                try
                {
                    var outwardList = db.OutwardHDRs.Where(a => a.FinyearID == finyearId && a.CompanyID == cid && a.BranchID == bid).OrderByDescending(b => b.OutwardNo).ToList(); 
                    outwardList.ForEach(a =>
                    {
                        str.Add(a.OutwardNo);
                    });
                    return Request.CreateResponse(HttpStatusCode.OK, str);
                }
                catch (Exception ex)
                {
                    return Request.CreateResponse(HttpStatusCode.InternalServerError, str);
                }
            }
        }

        [Route("api/ps/gb")]
        [HttpGet]
        public HttpResponseMessage GetBill(string billno, long fiyearid)
        {
            OutwardVM iow = null;
            var gat = new GetAttributeController();
            long cid = Convert.ToInt64(gat.GetCopmpanyId(User.Identity));
            long bid = Convert.ToInt64(gat.GetBranchId(User.Identity));
            using (SpareDBContext db = new SpareDBContext())
            {
                try
                {
                    iow = db.OutwardHDRs.Where(a => a.CompanyID == cid && a.FinyearID == fiyearid && a.BranchID == bid && a.OutwardNo == billno).ToList().Select(a => new OutwardVM()
                    {
                        OutwardID = a.OutwardID,
                        OutwardNo = a.OutwardNo,
                        OutwardDate = a.OutwardDate.ToString("dd-MM-yyyy"),
                        CompanyID = a.CompanyID,
                        FinyearID = a.FinyearID,
                        BranchID = a.BranchID,
                        SubledgerID = a.SubledgerID,
                        PartyAddress = db.BrunchParties.FirstOrDefault(b => b.SubLedgerID == a.SubledgerID && b.BranchID == a.BranchID).Address,
                        PartyGSTIN = db.BrunchParties.FirstOrDefault(b => b.SubLedgerID == a.SubledgerID && b.BranchID == a.BranchID).GSTNo,
                        PartyStateCode = db.BrunchParties.FirstOrDefault(b => b.SubLedgerID == a.SubledgerID && b.BranchID == a.BranchID).State.Code,
                        StateName = db.BrunchParties.FirstOrDefault(b => b.SubLedgerID == a.SubledgerID && b.BranchID == a.BranchID).State.StateName,
                        BillTypeID = a.BillTypeID,
                        TotalGross = a.TotalGross,
                        TotalDiscount = a.TotalDiscount,
                        TotalCGST = a.TotalCGST,
                        TotalSGST = a.TotalSGST,
                        TotalIGST = a.TotalIGST,
                        TotalTCSAmount=a.TotalTCSAmount,
                        IsTCS=a.IsTCS,
                        RoundOff=a.RoundOff,
                        TotalOtherCharges = a.TotalOtherCharges,
                        TotalNetAmt = a.TotalNetAmt,
                        TotalTaxable = a.TotalTaxable,

                        OutwadDetailsVM = a.OutwardDTLs.ToList().Select(b => new OutwadDetailVM()
                        {
                            LineID = b.LineID,
                            OutwardID = b.OutwardID,
                            ItemID = b.ItemID,
                            ItemCode = b.Item.ItemCode,
                            ItemName = b.Item.ItemName,
                            StockID = b.StockID,
                            RackNo = b.ItemStock.RackNo,
                            MRP = b.MRP,
                            Qty = b.Qty,
                            Rate = b.Rate,
                            Gross = b.Gross,
                            DiscPercent = b.DiscPercent,
                            DiscAmt = b.DiscAmt,
                            Taxable = b.Taxable,
                            GSTPercent = b.Item.GST,
                            CGSTPercent = b.CGSTPercent,
                            CGSTAmt = b.CGSTAmt,
                            SGSTPercent = b.SGSTPercent,
                            SGSTmt = b.SGSTmt,
                            IGSTPercent = b.IGSTPercent,
                            IGSTAmt = b.IGSTAmt,
                            NetAmt = b.NetAmt
                        }).ToList()
                    }).FirstOrDefault();

                    return Request.CreateResponse(HttpStatusCode.OK, iow);
                }
                catch (Exception ex)
                {
                    return Request.CreateResponse(HttpStatusCode.InternalServerError);
                }
            }
        }


        [Route("api/ps/si")]
        [HttpGet]
        public HttpResponseMessage InitStock(long fid)
        {

            try
            {
                string msg = string.Empty;
                var gat = new GetAttributeController();
                long cid = Convert.ToInt64(gat.GetCopmpanyId(User.Identity));
                long bid = Convert.ToInt64(gat.GetBranchId(User.Identity));
                using (SpareDBContext db = new SpareDBContext())
                {
                    SqlParameter companyParam = new SqlParameter("@CompanyId", cid);
                    SqlParameter branchParam = new SqlParameter("@BranchID", bid);
                    SqlParameter finParamm = new SqlParameter("@FinyearId", fid);
                    SqlParameter errorParam = new SqlParameter("@error", 10);
                    errorParam.Direction = System.Data.ParameterDirection.Output;
                    errorParam.SqlDbType = System.Data.SqlDbType.Int;
                    db.Database.ExecuteSqlCommand("usp_StockInitialization @CompanyId,@BranchID,@FinyearId,@error OUT", companyParam, branchParam, finParamm, errorParam);
                    int outpram = Convert.ToInt32(errorParam.Value);
                    if (outpram == 0)
                    {
                        msg = "Stok successfully initialize";
                    }
                    else if (outpram == 1)
                    {
                        msg = "DB Error Occured!";
                    }
                    else if (outpram == 2)
                    {
                        msg = "Finyear not found!";
                    }
                    return Request.CreateResponse(HttpStatusCode.OK, msg);
                }
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, "Internal server error!");
            }
        }

        public string GetOutwardNo(long cid, long bid, long finyearid)
        {
            string orddSrl = string.Empty;
            using (SpareDBContext db = new SpareDBContext())
            {
                long owNo = 0;
                var ow = db.OutwardHDRs.Where(a => a.CompanyID == cid && a.FinyearID == finyearid && a.BranchID == bid).OrderByDescending(b => b.OutwardSrl).FirstOrDefault();
                if (ow != null)
                {
                    owNo = ow.OutwardSrl;
                }
                owNo++;
                string no = "BA" + db.FinancialYears.FirstOrDefault(a => a.FinYearID == finyearid).Description + "/" + db.Branches.FirstOrDefault(a => a.BranchID == bid).Code + "/" + owNo.ToString().PadLeft(4, '0');
                orddSrl = string.Format("{0}${1}", owNo.ToString(), no);
            }
            return orddSrl;
        }
    }

}
