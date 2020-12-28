/// <reference path="main-app.js" />
/// <reference path="E:\Debdut\Latest Projects\SPAREPARTS WEB\Client\PartsClient\PartsClient\scripts/zebra_dialog.js" />
myApp.controller('partsSaleController', ['$scope', '$sce', 'partSaleDataServie', function ($scope, $sce, partSaleDataServie) {
    $scope.finyearid = parseInt(angular.fromJson(sessionStorage.finyearid));
    $scope.branch_state = angular.fromJson(sessionStorage.BranchStateCode);

    $('#txtBillDate').datepicker({
        dateFormat: "dd-mm-yy",
        maxDate: new Date(),
    });
    $scope.msg = null;
    $scope.Parties = [];
    $scope.BillTypes = [];
    $scope.Items = [];
    $scope.item = {};
    $scope.OutwardList = [];
    $scope.SaleHdr = {};
    $scope.SaleDtls = [];
    $scope.prn = {};
    $scope.mrpDisabled = true;
    $scope.disabled = true;
    $scope.show = false;
    //#### For Data Fetch
    partSaleDataServie.GetDBSubledger().then(function (resp) {
        if (resp.status == 200) {
            $scope.Parties = resp.data;
        }
    }, function (xhr) { });
    partSaleDataServie.GetDBBillTypes().then(function (resp) {
        if (resp.status == 200) {
            $scope.BillTypes = resp.data;
        }
    }, function (xhr) { });
    $scope.GetSubledgerDetails = function () {
        if ($scope.prt != null) {
            if ($scope.prt.SubLedgerID != 0) {
                $scope.SaleHdr.SubledgerID = $scope.prt.SubLedgerID;
                $scope.SaleHdr.PartyStateCode = $scope.prt.StateCode;
                $scope.SaleHdr.StateName = $scope.prt.StateName;
                $scope.SaleHdr.PartyGSTIN = $scope.prt.GSTNo;
                $scope.SaleHdr.PartyAddress = $scope.prt.Address;
            }
            else {
                $scope.SaleHdr.SubledgerID = 0;
                $scope.SaleHdr.PartyStateCode = '';
                $scope.SaleHdr.StateName = '';
                $scope.SaleHdr.PartyGSTIN = '';
                $scope.SaleHdr.PartyAddress = '';
            }
        }
        else {
            $scope.SaleHdr.SubledgerID = 0;
            $scope.SaleHdr.PartyStateCode = '';
            $scope.SaleHdr.StateName = '';
            $scope.SaleHdr.PartyGSTIN = '';
            $scope.SaleHdr.PartyAddress = '';
        }
        $scope.CalculateItemNet();
    }

    partSaleDataServie.GetOutwardList($scope.finyearid).then(function (resp) {
        if (resp.status == 200) {
            $scope.OutwardList = resp.data;
        }
    }, function () { });

    $scope.complete = function () {
        console.log($scope.OutwardList);
        $('#txtSearch').autocomplete({
            source: $scope.OutwardList
        });
    }
    //### 

    // #### fro Grid handels
    $scope.GetItems = function () {
        $scope.enable(2);
        partSaleDataServie.GetDBItems($scope.finyearid, $scope.item.ItemCode).then(function (resp) {
            if (resp.status == 200) {
                var data = resp.data;
                if (data != null) {
                    $scope.msg = null;
                    $scope.item = resp.data;
                    $scope.mrpDisabled = true;
                    $scope.enable(resp.status);
                    // $scope.m = $scope.Items[0];
                    //$scope.GetItem();
                }
                else {
                    //$scope.item = {};
                    $scope.msg = resp.data;
                    $scope.mrpDisabled = false;
                    $scope.enable(300);
                }
            }
            if (resp.status == 404) {
                //$scope.item = {};
                $scope.msg = resp.data;
                $scope.mrpDisabled = true;
                $scope.enable(resp.status);
            }
            if (resp.status == 500) {
                $scope.item = {};
                $scope.mrpDisabled = true;
                $scope.enable(resp.status);
            }
        }, function (xhr) {
            $scope.item = {};
            $scope.mrpDisabled = true;
            $scope.enable(xhr.status);
        });
    }
    //$scope.GetItem = function () {
    //    if ($scope.m != null) {
    //        if ($scope.m.StockID > 0) {
    //            $scope.item.LineID = $scope.m.LineID;
    //            $scope.item.InwardID = $scope.m.InwardID;
    //            $scope.item.ItemID = $scope.m.ItemID;
    //            $scope.item.ItemCode = $scope.m.ItemCode;
    //            $scope.item.ItemName = $scope.m.ItemName;
    //            $scope.item.StockID = $scope.m.StockID;
    //            $scope.item.RackNo = $scope.m.RackNo;
    //            $scope.item.MRP = $scope.m.MRP;
    //            $scope.item.StockQty = $scope.m.StockQty;
    //            $scope.item.Qty = $scope.m.Qty;
    //            $scope.item.Rate = $scope.m.Rate;
    //            $scope.item.Gross = $scope.m.Gross;
    //            $scope.item.DiscPercent = $scope.m.DiscPercent;
    //            $scope.item.DiscAmt = $scope.m.DiscAmt;
    //            $scope.item.Taxable = $scope.m.Taxable;
    //            $scope.item.GSTPercent = $scope.m.GSTPercent;
    //            $scope.item.CGSTPercent = $scope.m.CGSTPercent;
    //            $scope.item.CGSTAmt = $scope.m.CGSTAmt;
    //            $scope.item.SGSTPercent = $scope.m.SGSTPercent;
    //            $scope.item.SGSTmt = $scope.m.SGSTmt,
    //            $scope.item.IGSTPercent = $scope.m.IGSTPercent;
    //            $scope.item.IGSTAmt = $scope.m.IGSTAmt;
    //            $scope.item.NetAmt = $scope.m.NetAmt;
    //            $scope.enable(200);
    //        }
    //        else {
    //            $scope.item.LineID = 0;
    //            $scope.item.InwardID = 0;
    //            $scope.item.ItemID = 0;
    //            // $scope.item.ItemCode = $scope.m.ItemCode;
    //            $scope.item.ItemName = '';
    //            $scope.item.StockID = 0;
    //            $scope.item.RackNo = 0;
    //            $scope.item.MRP = 0;
    //            $scope.item.StockQty = 0;
    //            $scope.item.Qty = 0;
    //            $scope.item.Rate = 0;
    //            $scope.item.Gross = 0;
    //            $scope.item.DiscPercent = 0;
    //            $scope.item.DiscAmt = 0;
    //            $scope.item.Taxable = 0;
    //            $scope.item.GSTPercent = 0;
    //            $scope.item.CGSTPercent = 0;
    //            $scope.item.CGSTAmt = 0;
    //            $scope.item.SGSTPercent = 0;
    //            $scope.item.SGSTmt = 0,
    //            $scope.item.IGSTPercent = 0;
    //            $scope.item.IGSTAmt = 0;
    //            $scope.item.NetAmt = 0;
    //            $scope.enable(2);
    //        }
    //    }
    //    else {
    //        $scope.item.LineID = 0;
    //        $scope.item.InwardID = 0;
    //        $scope.item.ItemID = 0;
    //        // $scope.item.ItemCode = $scope.m.ItemCode;
    //        $scope.item.ItemName = '';
    //        $scope.item.StockID = 0;
    //        $scope.item.RackNo = 0;
    //        $scope.item.MRP = 0;
    //        $scope.item.StockQty = 0;
    //        $scope.item.Qty = 0;
    //        $scope.item.Rate = 0;
    //        $scope.item.Gross = 0;
    //        $scope.item.DiscPercent = 0;
    //        $scope.item.DiscAmt = 0;
    //        $scope.item.Taxable = 0;
    //        $scope.item.GSTPercent = 0;
    //        $scope.item.CGSTPercent = 0;
    //        $scope.item.CGSTAmt = 0;
    //        $scope.item.SGSTPercent = 0;
    //        $scope.item.SGSTmt = 0,
    //        $scope.item.IGSTPercent = 0;
    //        $scope.item.IGSTAmt = 0;
    //        $scope.item.NetAmt = 0;
    //        $scope.enable(2);
    //    }

    //}
    $scope.enable = function (fl) {
        if (fl == 200) {
            $scope.disabled = false;
            $scope.show = true;
        }
        else {
            //$scope.disabled = true;
            //$scope.show = false;
            $scope.disabled = true;
            $('#txtsCode').focus();
        }

    }
    $scope.CalculateItemNet = function () {
        if ($scope.item.StockID > 0) {//(a.MRP * 100) / (100 + a.Item.GST)

            $scope.item.Rate = parseFloat((($scope.item.MRP * 100) / (100 + $scope.item.GSTPercent)).toFixed(2));
            $scope.item.Gross = ($scope.item.Rate * $scope.item.Qty).toFixed(2);
            $scope.item.DiscAmt = ((parseFloat($scope.item.Gross) * parseFloat($scope.item.DiscPercent)) / 100).toFixed(2);
            $scope.item.Taxable = (parseFloat($scope.item.Gross) - parseFloat($scope.item.DiscAmt)).toFixed(2);
            if ($.trim($scope.SaleHdr.PartyStateCode) == $.trim($scope.branch_state)) {
                $scope.item.CGSTPercent = (parseFloat($scope.item.GSTPercent) / 2).toFixed(2);
                $scope.item.SGSTPercent = (parseFloat($scope.item.GSTPercent) / 2).toFixed(2);
                $scope.item.IGSTPercent = (0).toFixed(2);
                $scope.item.SGSTmt = ((parseFloat($scope.item.Taxable) * parseFloat($scope.item.SGSTPercent)) / 100).toFixed(2);
                $scope.item.CGSTAmt = ((parseFloat($scope.item.Taxable) * parseFloat($scope.item.CGSTPercent)) / 100).toFixed(2);
                $scope.item.IGSTAmt = (0).toFixed(2);
            }
            else {
                $scope.item.CGSTPercent = (0).toFixed(2);
                $scope.item.SGSTPercent = (0).toFixed(2);
                $scope.item.IGSTPercent = (parseFloat($scope.item.GSTPercent)).toFixed(2);
                $scope.item.SGSTmt = (0).toFixed(2);
                $scope.item.CGSTAmt = (0).toFixed(2);
                $scope.item.IGSTAmt = ((parseFloat($scope.item.Taxable) * parseFloat($scope.item.IGSTPercent)) / 100).toFixed(2);
            }
            $scope.item.NetAmt = (parseFloat($scope.item.Taxable) + parseFloat($scope.item.CGSTAmt) + parseFloat($scope.item.SGSTmt) + parseFloat($scope.item.IGSTAmt)).toFixed(2);
        }
    }

    // #### For Add,Update,Delete
    $scope.AddtoCart = function () {
        $scope.SaleDtls.push($scope.item);
        $scope.item = {};
        $scope.GetGrandTotal();
        $scope.enable(2);
    }
    $scope.EditeCart = function (sd) {
        $scope.item = sd;
        //$scope.GetItems();
        $scope.SaleDtls.splice($scope.SaleDtls.indexOf(sd), 1);
        $scope.GetGrandTotal();
        $scope.enable(200);
    }
    $scope.DeleteCart = function (sd) {
        // $scope.item = sd;
        //$scope.GetItems();
        $scope.SaleDtls.splice($scope.SaleDtls.indexOf(sd), 1);
        $scope.GetGrandTotal();
        $scope.enable(200);
    }

    //####
    $scope.GetGrandTotal = function () {
        $scope.TotalQty = 0;
        $scope.TotalGross = 0;
        $scope.TotalDiscAmt = 0;
        $scope.TotalTaxable = 0;
        $scope.TotalCGST = 0;
        $scope.TotalSGST = 0;
        $scope.TotalIGST = 0;
        $scope.SumNet = 0;
        $scope.SaleHdr.RoundOff = 0;
        angular.forEach($scope.SaleDtls, function (i) {
            $scope.TotalQty += parseFloat(i.Qty);
            $scope.TotalGross += parseFloat(i.Gross);
            $scope.TotalDiscAmt += parseFloat(i.DiscAmt);
            $scope.TotalTaxable += parseFloat(i.Taxable);
            $scope.TotalCGST += parseFloat(i.CGSTAmt);
            $scope.TotalSGST += parseFloat(i.SGSTmt);
            $scope.TotalIGST += parseFloat(i.IGSTAmt);
            $scope.SumNet += parseFloat(i.NetAmt);
        });
        if ($scope.SaleHdr.isTCS == 1) {
            var tcsamt = parseFloat($scope.SumNet * 0.075 / 100);
            $scope.SaleHdr.TotalTCSAmount = (parseFloat(tcsamt)).toFixed(2);
        }
        else if ($scope.SaleHdr.isTCS == 2) {
            var tcsamt = parseFloat($scope.SumNet * 0.750 / 100);
            $scope.SaleHdr.TotalTCSAmount = (parseFloat(tcsamt)).toFixed(2);
        }
        else {
            var tcsamt = 0;
            $scope.SaleHdr.TotalTCSAmount = (parseFloat(tcsamt)).toFixed(2);
        }
        var afterfround = Math.round($scope.SumNet + tcsamt);
        $scope.SaleHdr.RoundOff = (afterfround - ($scope.SumNet + tcsamt)).toFixed(2);
        $scope.SaleHdr.TotalNetAmt = (afterfround).toFixed(2);

        //var afterfround = Math.round($scope.SumNet);
        //$scope.SaleHdr.RoundOff = (afterfround - $scope.SumNet).toFixed(2);
        //$scope.SaleHdr.TotalNetAmt = (afterfround).toFixed(2);
    }

    $scope.Save = function () {
        var validatemsg = [];
        if ($scope.SaleHdr.OutwardDate == null || $scope.SaleHdr.OutwardDate == '') {
            validatemsg.push('Please enter Bill Date.');
        }
        if ($scope.SaleHdr.SubledgerID < 1) {
            validatemsg.push('Please select a party.');
        }
        if ($scope.SaleHdr.BillTypeID < 1) {
            validatemsg.push('Please select bill type.');
        }
        if (isNaN($scope.SaleHdr.TotalNetAmt) || $scope.SaleHdr.TotalNetAmt == 0) {
            validatemsg.push('Please enter atleast one item.');
        }
        if (validatemsg.length > 0) {
            var validSummary = '';
            var ul = '<ul>';
            var li = '';
            $.each(validatemsg, function (i, val) {
                li += '<li>' + val + '</li>';
            });
            validSummary += ul + li + '</ul>';

            $.Zebra_Dialog('<strong>Validation Summary</strong><br/>' + validSummary, {
                'type': 'warning',
                'title': 'Warning'
            });
            return true;
        }
        if (validatemsg.length == 0) {
            if ($scope.SaleHdr.FinyearID == null || $scope.SaleHdr.FinyearID <= 0) {
                $scope.SaleHdr.FinyearID = $scope.finyearid;
            }
            $scope.SaleHdr.OutwadDetailsVM = $scope.SaleDtls;
            partSaleDataServie.SaveToDB($scope.SaleHdr).then(function (resp) {
                $scope.prn = {};
                if (resp.status == 200) {
                    $scope.prn = resp.data;
                    $.Zebra_Dialog('Bill No: ( ' + $scope.prn.EntityCode + ' ) successfully Updated.</br>Do you want to print?', {
                        'type': 'question', 'title': 'Confirmation', 'buttons': [{
                            caption: 'Yes', callback: function () {
                                $scope.Refresh();
                                $scope.Print();
                            }
                        }, {
                            caption: 'No', callback: function () {
                                $scope.Refresh();
                            }
                        }]
                    });
                    //$.Zebra_Dialog('<strong>Success</strong>: Bill No : ' + $scope.prn.EntityCode + ' Updated Successfully', {
                    //    type: 'information',
                    //    title: 'Information'
                    //});
                }
                if (resp.status == 201) {
                    //$scope.Refresh();
                    $scope.prn = resp.data;
                    $.Zebra_Dialog('Bill No: ( ' + $scope.prn.EntityCode + ' ) successfully Saved.</br>Do you want to print?', {
                        'type': 'question', 'title': 'Confirmation', 'buttons': [{
                            caption: 'Yes', callback: function () {
                                $scope.Refresh();
                                $scope.Print();
                            }
                        }, {
                            caption: 'No', callback: function () {
                                $scope.Refresh();
                            }
                        }]
                    });


                    //$.Zebra_Dialog('<strong>Success</strong>: Bill No : ' + $scope.prn.EntityCode + ' Created Successfully', {
                    //    type: 'information',
                    //    title: 'Information'
                    //});
                }
                if (resp.status == 400) {
                    $.Zebra_Dialog('<strong>WARNING</strong>: ' + resp.data, {
                        type: 'warning',
                        title: 'Warning'
                    });
                }
            }, function (xhr) { });
        }
    }

    $scope.GetBill = function () {
        var billno = $.trim($('#txtSearch').val());
        if (billno != '') {
            partSaleDataServie.GetDBBill(billno, $scope.finyearid).then(function (resp) {
                if (resp.status == 200) {
                    var data = resp.data;
                    $scope.SaleHdr = data;
                    $scope.prn.EntityID = $scope.SaleHdr.OutwardID;
                    $scope.prn.EntityCode = $scope.SaleHdr.OutwardNo;
                    $scope.prt = $scope.Parties.find(o=>o.SubLedgerID == data.SubledgerID);
                    $scope.SaleDtls = data.OutwadDetailsVM;
                    $scope.GetGrandTotal();
                }
            }, function () { })
        }
    }

    $scope.Refresh = function () {
        $scope.Items = [];
        $scope.item = {};
        $scope.SaleHdr = {};
        $scope.SaleDtls = [];
        $scope.OutwardList = [];
        $scope.enable(1);
        $scope.GetGrandTotal();
        partSaleDataServie.GetOutwardList($scope.finyearid).then(function (resp) {
            if (resp.status == 200) {
                $scope.OutwardList = resp.data;
            }
        }, function () { });
        partSaleDataServie.GetDBSubledger().then(function (resp) {
            if (resp.status == 200) {
                $scope.Parties = resp.data;
            }
        }, function (xhr) { });
        partSaleDataServie.GetDBBillTypes().then(function (resp) {
            if (resp.status == 200) {
                $scope.BillTypes = resp.data;
            }
        }, function (xhr) { });
        $scope.prt.SubLedgerID = '';

    }

    $scope.Print = function () {
        var fileName = "invoice.pdf";
        var a = document.createElement("a");
        document.body.appendChild(a);
        partSaleDataServie.PrintInvoice($scope.prn.EntityID).then(function (resp) {
            //var file = new Blob([resp.data], { type: 'application/vnd.openxmlformats - officedocument.spreadsheetml.sheet' }); For Excel
            var file = new Blob([resp.data], { type: 'application/pdf' });
            var fileURL = window.URL.createObjectURL(file);
            window.open(fileURL);
            //a.href = fileURL;
            //a.download = fileName;
            //a.click();
        });
    }

    $scope.StockReindex = function () {
        partSaleDataServie.stockreindex($scope.finyearid).then(function (resp) {
            if (resp.status == 200) {
                $.Zebra_Dialog('<strong>Success</strong>: ' + resp.data, {
                    type: 'success',
                    title: 'Success'
                });
            }
            else if (resp.status == 500) {
                $.Zebra_Dialog('<strong>Error</strong>: ' + resp.data, {
                    type: 'error',
                    title: 'Error'
                });
            }

        }, function (xhr) {
            $.Zebra_Dialog('<strong>Error</strong>: Some error occured! ', {
                type: 'error',
                title: 'Error'
            });
        });
    }

}])

.factory('partSaleDataServie', ['$http', 'serviceBasePath', function ($http, serviceBasePath) {
    var fac = {};
    fac.GetDBSubledger = function () {
        return $http.get(serviceBasePath + '/api/ps/sb').then(function (resp) { return resp; }, function (xhr) { return xhr; });
    }

    fac.GetDBBillTypes = function () {
        return $http.get(serviceBasePath + '/api/ps/typ').then(function (resp) { return resp; }, function (xhr) { return xhr; });
    }

    fac.GetDBItems = function (f, p) {
        var dataparam = $.param({ finid: f, partNo: p });
        return $http.get(serviceBasePath + '/api/ps/Its?' + dataparam).then(function (resp) { return resp; }, function (xhr) { return xhr; });
    }

    fac.SaveToDB = function (sale) {
        return $http.post(serviceBasePath + '/api/ps/ssb', sale).then(function (resp) { return resp; }, function (xhr) {
            $.Zebra_Dialog('<strong>WARNING</strong>: ' + xhr.data, {
                type: 'warning',
                title: 'Warning'
            });
        })
    }

    fac.GetOutwardList = function (fin) {
        var dataparam = $.param({ finyearId: fin });
        return $http.get(serviceBasePath + '/api/ps/gsc?' + dataparam).then(function (resp) { return resp; }, function (xhr) { return xhr; });
    }

    fac.GetDBBill = function (bno, fid) {
        var dataparam = $.param({ billno: bno, fiyearid: fid })
        return $http.get(serviceBasePath + '/api/ps/gb?' + dataparam).then(function (resp) { return resp; }, function (xhr) { return xhr; });
    }

    fac.PrintInvoice = function (id) {
        var dataParam = $.param({ oid: id })
        return $http.get(serviceBasePath + '/api/rpc/inv?' + dataParam, { responseType: 'arraybuffer' })
       .then(function (resp) {
           return resp;
       }, function (xhr) {

       });
    }

    fac.stockreindex = function (fid) {
        var dataparam = $.param({ fid: fid })
        return $http.get(serviceBasePath + '/api/ps/si?' + dataparam).then(function (resp) { return resp; }, function (xhr) { return xhr; });
    }

    return fac;
}])