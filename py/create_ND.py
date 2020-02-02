import os
import arcpy
arcpy.CheckOutExtension('network')

gtfs_folders = r'C:\Users\stephan.79\Desktop\Visualization Data\GTFS'

#Streets feature needs a RestrictPedestrians attribute, Y or N
streets_orig = r'C:\Users\stephan.79\Documents\ArcGIS\Projects\MyProject\MyProject.gdb\Streets'

working_folder = r'C:\Users\stephan.79\Desktop\Visualization Data'
nd_template = os.path.join(working_folder, 'TransitNetworkTemplate.xml')
gdb_name = 'TransitNetwork.gdb'
output_gdb = os.path.join(working_folder, gdb_name)
out_coord_sys = arcpy.SpatialReference(4326)
fd_name = 'TransitNetwork'
fd_path = os.path.join(output_gdb, fd_name)
streets = os.path.join(fd_path, 'Streets')
nd_name = 'TransitNetwork_ND'
nd_path = os.path.join(fd_path, nd_name)

arcpy.management.CreateFileGDB(working_folder, gdb_name)
arcpy.management.CreateFeatureDataset(output_gdb, fd_name, out_coord_sys)

arcpy.FeatureClassToFeatureClass_conversion(streets_orig, fd_path, "Streets")

arcpy.conversion.GTFSToNetworkDatasetTransitSources(gtfs_folders, fd_path)

where = "RestrictPedestrians = 'N'"
arcpy.conversion.ConnectNetworkDatasetTransitSourcesToStreets(fd_path, streets, '100 meters', where)

arcpy.na.CreateNetworkDatasetFromTemplate(nd_template, fd_path)

arcpy.na.BuildNetwork(nd_path)

#Edit TransitNetwork_ND travel attributes before creating service areas

#To create service areas: Analysis > Network Analysis > Service Area

