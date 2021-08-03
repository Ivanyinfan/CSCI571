gcloud projects create csci-571-hw8 --set-as-default
gcloud projects describe csci-571-hw8-273802
gcloud app create --project=csci-571-hw8-273802
cd nodejs-docs-samples/appengine/hello-world/standard
E:/Google/"Cloud SDK"/google-cloud-sdk/bin/gcloud.cmd app deploy
E:/Google/"Cloud SDK"/google-cloud-sdk/bin/gcloud.cmd app browse
http://csci-571-hw8-273802.wl.r.appspot.com/
cd D:\Temp\CSCI571-HW8\front-end
E:/Google/"Cloud SDK"/google-cloud-sdk/bin/gcloud.cmd app logs tail -s default
E:/Google/"Cloud SDK"/google-cloud-sdk/bin/gcloud.cmd logging read
E:/Google/"Cloud SDK"/google-cloud-sdk/bin/gcloud.cmd logging read "logName=projects/csci-571-hw8-273802/logs/syslog"
E:/Google/"Cloud SDK"/google-cloud-sdk/bin/gcloud.cmd app logs read --level=error
