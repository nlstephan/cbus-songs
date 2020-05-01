import os
import arcpy
arcpy.CheckOutExtension('network')

def getParameterInfo(self):

    gtfs_param = arcpy.Parameter(
        displayName = 'GTFS Folder Location',
        name = 'gtfs_folders',
        datatype = 'DEFolder',
        parameterType = 'Required',
        direction = 'Input'
    )

    streets_param = arcpy.Parameter(  #Streets feature needs a RestrictPedestrians attribute, Y or N
        displayName = 'Streets',
        name = 'streets_orig',
        datatype = 'DEFeatureClass',
        parameterType = 'Required',
        direction = 'Input'
    )

    template_param = arcpy.Parameter(
        displayName = 'Network Dataset Template',
        name = 'nd_template',
        parameterType = 'Required',
        direction = 'Input'
    )

    gdb_param = arcpy.Parameter(
        displayName = 'Output Geodatabase',
        name = 'gdb_name'
        datatype = 'DERemoteDatabaseFolder',
        parameterType = 'Required',
        direction = 'Input'
    )

    working_param = arcpy.Parameter(
        displayName = 'Working Folder Path',
        name = 'working_folder',
        datatype = 'DEFolder',
        parameterType = 'Required',
        direction = 'Input'
    )

    fdname_param = arcpy.Parameter(
        displayName = 'Dataset Name',
        name = 'fd_name',
        datatype = 'GPString',
        parameterType = 'Required',
        direction = 'Input'

    )

    ndname_param = arcpy.Parameter(
        displayName = 'Network Dataset Name',
        name = 'nd_name',
        datatype = 'GPString',
        parameterType = 'Required',
        direction = 'Input'
    )

    params = [gtfs_param, streets_param, template_param, gdb_param, working_param, fdname_param, ndname_param]

    return params



out_coord_sys = arcpy.SpatialReference(4326)


fd_path = os.path.join(output_gdb, fd_name)
streets = os.path.join(fd_path, 'Streets')
nd_path = os.path.join(fd_path, nd_name)

#Create GDB and dataset where network will be stored
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

#For reference: https://pro.arcgis.com/en/pro-app/help/analysis/networks/create-and-use-a-network-dataset-with-public-transit-data.htm