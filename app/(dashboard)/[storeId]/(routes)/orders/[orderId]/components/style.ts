import { StyleSheet } from "@react-pdf/renderer";
import { relative } from "path";

export const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    color: "#262626",
    fontFamily: "Helvetica",
    fontSize: "12px",
    padding: "30px 50px",
    position: "relative",
  },
  content: {
    position: 'relative', // Ensure content is above the watermark
    padding: 20,
  },
  background: {
    position: 'absolute',
    width: '100%',  // Stretch across the entire page width
    height: '100%', // Stretch across the entire page height
    opacity: 0.2,   // Set transparency for watermark effect
    // transform: 'rotate(-30deg)', // Tilt the image
    // left: '50%',  // Shift left to ensure rotation covers the page
    top: '50%',    // Adjust positioning
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  logoIMG: {
    // flexDirection: "row",
    // justifyContent: "space-between",
    // marginBottom: 20,
    width: "50%"
  },
  title: {
    fontSize: 24,
  },
  textBold: {
    fontFamily: "Helvetica-Bold",
  },
  spaceY: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  billTo: {
    marginBottom: 10,
  },
  table: {
    width: "100%",
    borderColor: "1px solid #f3f4f6",
    margin: "20px 0",
    display: "flex", 
    borderCollapse: "collapse",
  },
  tableHeader: {
    fontWeight: "bold",
    backgroundColor: "#e5e5e5",
    // backgroundColor: "#f2f2f2",
  },
  tableRow: { 
    flexDirection: "row", 
    borderBottom: "1px solid #000" 
  },
  tableCell: { 
    padding: 5, width: "33%", 
    borderRight: "1px solid #000" 
  },
  td: {
    padding: 6,
  },
  totals: {
    display: "flex",
    alignItems: "flex-end",
  },
});
